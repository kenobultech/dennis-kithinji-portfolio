import dbConnect from '@/lib/mongoose';
import Post from '@/models/Post';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Clock, Terminal } from 'lucide-react';
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
        <p className="text-gray-400 mb-8 z-10">LOG_ENTRY_NOT_FOUND</p>
        <Link href="/blog" className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-950/30 transition-all rounded-full font-mono z-10">
          ../Return_to_Database
        </Link>
      </div>
    );
  }

  // Calculate generic read time
  const words = post.content.split(' ').length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="min-h-screen bg-cyber-black text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* --- NAVIGATION --- */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/blog"
          className="group flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-cyan-500/50 transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-mono hidden sm:inline">Database</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-32 pb-20 px-6">
        
        {/* --- HEADER SECTION --- */}
        <header className="text-center space-y-8 mb-16">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap justify-center gap-3 text-sm font-mono text-cyan-400/80">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20">
              <Calendar size={12} />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20">
              <Clock size={12} />
              {readTime} min read
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] text-balance bg-clip-text">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="text-gray-500 text-sm hover:text-cyan-400 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* --- CONTENT SECTION --- */}
        <div className="prose prose-invert prose-lg md:prose-xl max-w-none mx-auto">
          <ReactMarkdown
            components={{
              // 1. HEADINGS
              h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-cyan-400 mt-12 mb-6 border-b border-white/10 pb-2" {...props} />,
              h2: ({node, ...props}) => <h3 className="text-2xl font-semibold text-white mt-10 mb-4" {...props} />,
              h3: ({node, ...props}) => <h4 className="text-xl font-medium text-gray-200 mt-8 mb-3" {...props} />,
              
              // 2. PARAGRAPHS (Changed to div to prevent hydration errors)
              p: ({node, ...props}) => <div className="text-gray-300 leading-relaxed mb-6 font-light" {...props} />,

              // 3. IMAGES (The "Feature Image" Look)
              img: ({node, ...props}) => (
                <div className="my-10 relative group">
                  <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
                  <img 
                    {...props} 
                    className="relative rounded-xl border border-white/10 shadow-2xl w-full object-cover max-h-[600px] bg-[#0a0a0a]"
                    alt={props.alt || "blog visual"}
                  />
                  {props.alt && (
                    <span className="block text-center text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">
                      // {props.alt}
                    </span>
                  )}
                </div>
              ),

              // 4. BLOCKQUOTES
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-cyan-500 pl-6 my-8 italic text-xl text-gray-400 bg-white/5 py-4 pr-4 rounded-r-lg" {...props} />
              ),

              // 5. LINKS
              a: ({node, ...props}) => (
                <a className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 underline-offset-4 transition-all" {...props} />
              ),

              // 6. CODE BLOCKS (Terminal Style)
              code: ({node, inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="my-8 rounded-lg overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl">
                    {/* Fake Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="text-xs text-gray-500 font-mono flex items-center gap-1">
                            <Terminal size={10} />
                            {match ? match[1] : 'shell'}
                        </div>
                    </div>
                    {/* Code Content */}
                    <div className="text-sm">
                        {/* @ts-ignore - SyntaxHighlighter types can be tricky */}
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
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-cyan-900/20 rounded-full flex items-center justify-center text-cyan-400 mb-4 border border-cyan-500/20">
                <Terminal size={20} />
            </div>
            <h3 className="text-white font-bold text-lg">Dennis Kithinji</h3>
            <p className="text-gray-500 text-sm">Security Analyst • Network Defender</p>
        </div>

      </div>
    </article>
  );
}