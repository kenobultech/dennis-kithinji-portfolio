import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Clock, Terminal, Hash, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const isObjectId = (str: string) => /^[0-9a-fA-F]{24}$/.test(str);

// Fetch Logic
async function getPost(identifier: string) {
  await dbConnect();
  if (isObjectId(identifier)) {
    return await Post.findById(identifier);
  }
  return await Post.findOne({ slug: identifier });
}

export default async function SinglePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 blur-[100px]" />
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-600 z-10">404</h1>
        <p className="text-gray-400 mb-8 z-10 uppercase tracking-widest text-sm">Error: Log_Entry_Not_Found</p>
        <Link href="/blog" className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-950/30 transition-all rounded-full font-mono z-10 flex items-center gap-2">
           <Terminal size={16} /> Return_to_Database
        </Link>
      </div>
    );
  }

  // Calculate generic read time
  const words = post.content.split(' ').length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="min-h-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-[300px] bg-linear-to-b from-cyan-900/10 to-transparent pointer-events-none z-0" />
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* --- NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm border-b border-white/5 bg-black/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link 
            href="/blog"
            className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm font-mono font-bold tracking-wide">../BACK</span>
            </Link>
            <div className="text-xs font-mono text-gray-600 hidden sm:block">
                SYS.LOG.ID::{post._id.toString().slice(-6).toUpperCase()}
            </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6 sm:px-8">
        
        {/* --- HEADER SECTION (Title & Meta) --- */}
        <header className="mb-12 border-b border-white/10 pb-12">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="flex items-center gap-1 text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                <Hash size={10} />
                {tag}
              </span>
            ))}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex items-center gap-6 text-sm text-gray-500 font-mono">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 border border-white/10">
                    <Terminal size={14} />
                </div>
                <span>Dennis Kithinji</span>
            </div>
            <span className="text-gray-700">|</span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {readTime} min read
            </span>
          </div>
        </header>

        {/* --- CONTENT SECTION --- */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              // 1. HEADINGS
              h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-white mt-12 mb-6 flex items-center gap-2" {...props} />,
              h2: ({node, ...props}) => (
                <div className="mt-16 mb-6">
                    <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2" {...props} />
                    <div className="h-px w-full bg-linear-to-r from-cyan-500/50 to-transparent mt-2" />
                </div>
              ),
              h3: ({node, ...props}) => <h4 className="text-xl font-semibold text-gray-200 mt-8 mb-3" {...props} />,
              
              // 2. PARAGRAPHS
              p: ({node, ...props}) => <div className="text-gray-300 leading-8 mb-6 font-light text-[17px]" {...props} />,

              // 3. IMAGES (FIXED: No more cutting out)
              img: ({node, ...props}) => (
                <div className="my-10 group">
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl">
                     {/* The 'w-full h-auto' ensures the image is never cut off */}
                    <img 
                      {...props} 
                      className="w-full h-auto object-contain block"
                      alt={props.alt || "post visual"}
                    />
                    {/* Optional: Glossy overlay reflection */}
                    <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {props.alt && (
                    <div className="flex justify-center mt-3">
                        <span className="text-xs text-gray-600 font-mono flex items-center gap-2">
                            <ChevronRight size={12} className="text-cyan-500" />
                            IMAGE_SOURCE: {props.alt}
                        </span>
                    </div>
                  )}
                </div>
              ),

              // 4. BLOCKQUOTES
              blockquote: ({node, ...props}) => (
                <div className="relative my-10 pl-8 italic">
                    <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500 rounded-full" />
                    <blockquote className="text-gray-400 text-lg" {...props} />
                </div>
              ),

              // 5. LINKS
              a: ({node, ...props}) => (
                <a className="text-cyan-400 hover:text-white border-b border-cyan-500/30 hover:border-cyan-400 transition-colors pb-0.5 no-underline" {...props} />
              ),

              // 6. LISTS
              ul: ({node, ...props}) => <ul className="list-none space-y-2 my-6 pl-0" {...props} />,
              li: ({node, ...props}) => (
                  <li className="flex gap-3 text-gray-300">
                      <span className="text-cyan-500 mt-2 text-xs">●</span>
                      <span>{props.children}</span>
                  </li>
              ),

              // 7. CODE BLOCKS (Terminal Style)
              code: ({node, inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="my-10 rounded-lg overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl relative group">
                    {/* Fake Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#151515] border-b border-white/5">
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                            {match ? match[1] : 'sh'}
                        </div>
                    </div>
                    {/* Code Content */}
                    <div className="text-sm font-mono leading-relaxed">
                        {/* @ts-ignore */}
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match ? match[1] : 'text'}
                            PreTag="div"
                            customStyle={{ margin: 0, background: 'transparent', padding: '1.5rem' }}
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  <code className="bg-white/10 text-cyan-200 px-1.5 py-0.5 rounded font-mono text-sm border border-white/10" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* --- FOOTER / SIGNATURE --- */}
        <div className="mt-20 pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-cyan-400 border border-white/10">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Dennis Kithinji</h3>
                        <p className="text-gray-500 text-sm">System_Admin // Author</p>
                    </div>
                </div>
                <Link href="/blog" className="text-sm font-mono text-cyan-500 hover:text-white transition-colors">
                    End_of_Transmission_ //
                </Link>
            </div>
        </div>

      </div>
    </article>
  );
}