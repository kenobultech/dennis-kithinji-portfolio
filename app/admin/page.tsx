'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  LogOut, 
  FileText, 
  Loader2, 
  User, 
  ExternalLink, 
  Edit,
  Terminal,
  Search, 
  XCircle,
  ShieldAlert // Added for Projects
} from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Protect the route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Fetch posts (Logs)
  useEffect(() => {
    if (session) {
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setPosts(data.data);
          setLoading(false);
        });
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('CONFIRM DELETE: This action is irreversible. Proceed?')) return;
    
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((post) => post._id !== id));
    }
  };

  const filteredPosts = posts.filter((post) => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-500 font-mono">
        <Loader2 className="animate-spin mb-4" size={32} />
        <span className="animate-pulse">AUTHENTICATING_ADMIN_PRIVILEGES...</span>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                <span className="text-xs font-mono text-green-500 tracking-widest">SYSTEM_ONLINE</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-gray-500 font-mono text-sm mt-1">
              Operator: <span className="text-cyan-400">{session.user?.email || 'ROOT_USER'}</span>
            </p>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 border border-red-900/50 text-red-500 hover:bg-red-950/30 hover:text-red-400 rounded transition-colors text-sm font-mono uppercase"
          >
            <LogOut size={14} /> Terminate_Session
          </button>
        </div>

        {/* --- MODULES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* 1. PROJECTS MODULE (NEW) */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg group hover:border-cyan-500/50 transition-colors relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldAlert size={100} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="text-cyan-500" size={20} />
                    Mission Archive
                </h2>
                <p className="text-gray-400 text-sm mb-6 flex-1">
                    Manage projects, security tools, and tech stack details.
                </p>
                <Link 
                    href="/admin/projects"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-all text-sm font-bold"
                >
                    <Edit size={14} /> Manage Projects
                </Link>
            </div>

            {/* 2. BLOG MODULE */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg group hover:border-cyan-500/50 transition-colors relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Terminal size={100} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Terminal className="text-cyan-500" size={20} />
                    Log Management
                </h2>
                <p className="text-gray-400 text-sm mb-6 flex-1">
                    Create and decrypt technical articles and security findings.
                </p>
                <Link 
                    href="/admin/new"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-all text-sm font-bold"
                >
                    <Plus size={14} /> New Entry
                </Link>
            </div>

            {/* 3. RESUME MODULE */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg group hover:border-cyan-500/50 transition-colors relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <User size={100} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <User className="text-cyan-500" size={20} />
                    Identity Protocol
                </h2>
                <p className="text-gray-400 text-sm mb-6 flex-1">
                    Update CV, experience, skills matrix, and certifications.
                </p>
                <div className="flex gap-2">
                    <Link href="/admin/resume" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-all text-sm font-bold">
                        <Edit size={14} /> Edit
                    </Link>
                    <Link href="/resume" target="_blank" className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 rounded transition-all">
                        <ExternalLink size={14} />
                    </Link>
                </div>
            </div>

        </div>

        {/* --- BLOG POSTS LIST (Kept for quick access) --- */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden">
          
          {/* List Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="font-mono text-xs text-cyan-500 uppercase tracking-widest whitespace-nowrap">
                    // Recent_Logs
                </span>
                <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                    Total: {posts.length}
                </span>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors" size={14} />
                <input 
                    type="text" 
                    placeholder="Search Logs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded px-3 py-2 pl-9 text-sm text-white focus:border-cyan-500 focus:outline-none transition-all font-mono"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500">
                        <XCircle size={14} />
                    </button>
                )}
            </div>
          </div>
          
          {/* List Content */}
          {posts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-gray-500">
                <Terminal size={48} className="mb-4 opacity-20" />
                <p className="font-mono text-sm">No encrypted logs found.</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-gray-500">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="font-mono text-sm">No records match query.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {filteredPosts.map((post) => (
                <li key={post._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded text-gray-500 group-hover:text-cyan-400 transition-colors">
                        <FileText size={18} />
                    </div>
                    <div>
                        <Link href={`/blog/${post._id}`} className="font-medium text-gray-200 group-hover:text-cyan-400 transition-colors block">
                            {post.title}
                        </Link>
                        <span className="text-xs text-gray-600 font-mono">ID: {post._id.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-gray-500 font-mono hidden sm:block">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button onClick={() => handleDelete(post._id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-900/20 rounded transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}