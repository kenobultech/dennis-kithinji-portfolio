'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Terminal, Loader2, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Changed 'email' to 'username' to match backend credentials provider
    const res = await signIn('credentials', {
      redirect: false,
      username, 
      password,
    });

    if (res?.error) {
      setError('ACCESS_DENIED: Invalid credentials');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-lg shadow-2xl shadow-cyan-900/10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/20 text-red-500 mb-4 border border-red-500/20">
            <Lock size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            Restricted Area
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-2">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <User size={12} /> USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              placeholder="root_admin"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                <Lock size={12} /> PASSPHRASE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white/5 border border-white/10 text-white font-mono hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Terminal size={18} /> Authenticate
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}