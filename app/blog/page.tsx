'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Terminal, Search, X } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: Search State ---
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // --- NEW: Filter Logic ---
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <section className="min-h-screen pt-24 pb-20 px-6 bg-black text-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Security <span className="text-cyan-400">Log</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Thoughts on cybersecurity, ethical hacking, and software engineering.
          </p>
        </div>

        {/* --- NEW: Search Bar --- */}
        {!loading && posts.length > 0 && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search logs by keyword or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-4 pl-12 pr-12 text-gray-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder:text-gray-600 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 font-mono animate-pulse py-12 justify-center">
            <Terminal size={18} />
            <span>Fetching data packets...</span>
          </div>
        )}

        {/* Empty State (No posts at all) */}
        {!loading && posts.length === 0 && (
           <div className="text-gray-500 font-mono p-12 border border-dashed border-white/10 rounded-lg text-center">
             &lt; System_Empty: No_Logs_Found /&gt;
           </div>
        )}

        {/* No Search Results */}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="text-gray-500 font-mono p-12 border border-dashed border-white/10 rounded-lg text-center">
            <p>No matches for query "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')} 
              className="text-cyan-500 hover:underline mt-2 text-sm"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-8">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // Faster stagger for filtered results
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-xl p-6 md:p-8 hover:border-cyan-500/30 transition-all"
              >
                {/* Date & Tags */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {post.tags?.map(tag => (
                        <span key={tag} className="text-cyan-500/60 bg-cyan-950/30 px-2 py-0.5 rounded text-xs border border-transparent hover:border-cyan-500/50 transition-colors">
                            #{tag}
                        </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  <Link href={`/blog/${post.slug || post._id}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h2>

                {/* Summary */}
                <p className="text-gray-400 leading-relaxed mb-6">
                  {post.summary}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm">
                  Read Log <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}