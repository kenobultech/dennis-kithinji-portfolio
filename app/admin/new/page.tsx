'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Save, ArrowLeft, Image as ImageIcon, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// --- CUSTOM TOAST TYPE ---
type ToastType = 'success' | 'error' | null;

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Helper: Show Toast
  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        const imageMarkdown = `\n![${file.name}](${data.url})\n`;
        setContent((prev) => prev + imageMarkdown);
        showToast('success', 'Image uploaded!');
      } else {
        showToast('error', 'Upload failed.');
      }
    } catch (err) {
      showToast('error', 'Server error.');
    } finally {
      setUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('error', 'Title and Content are required.');
      return;
    }

    setLoading(true);

    const postData = {
      title,
      slug,
      summary,
      content,
      // FIX: Filter out empty strings so you don't get [""] in DB
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        showToast('success', 'Log encrypted & saved.');
        setTimeout(() => router.push('/admin'), 1000);
      } else {
        showToast('error', 'Failed to save.');
        setLoading(false);
      }
    } catch (error) {
      showToast('error', 'Network error.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-20 px-4 font-sans relative">
      
      {/* --- TOAST UI --- */}
      {toast && (
        <div className={`fixed top-4 right-4 z-100 flex items-center gap-3 px-4 py-3 rounded shadow-2xl border backdrop-blur-md animate-in slide-in-from-right
          ${toast.type === 'success' ? 'bg-green-950/90 border-green-500/50 text-green-200' : 'bg-red-950/90 border-red-500/50 text-red-200'}`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span className="font-mono text-sm font-bold">{toast.message}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col h-full">
        
        {/* --- RESPONSIVE HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Top Row on Mobile: Back Link + Save Button */}
          <div className="flex justify-between items-center w-full md:w-auto order-1">
            <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
              <ArrowLeft size={16} /> <span className="hidden xs:inline">Abort</span>
            </Link>
            
            {/* Mobile Save Button (Visible only on small screens) */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="md:hidden px-4 py-2 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 font-bold font-mono text-xs rounded hover:bg-cyan-500 hover:text-black flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              {loading ? 'SAVING...' : 'SAVE_LOG'}
            </button>
          </div>

          {/* Title (Order 2 on mobile, Center on Desktop) */}
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase order-2 md:order-0 text-left md:text-center">
            <span className="text-cyan-500 mr-2">///</span> 
            NEW BLOG ENTRY
          </h1>

          {/* Desktop Save Button (Hidden on mobile) */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="hidden md:flex order-3 px-6 py-2 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 font-bold font-mono rounded hover:bg-cyan-500 hover:text-black items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? 'ENCRYPTING...' : 'SAVE_LOG'}
          </button>
        </div>

        {/* --- EDITOR GRID --- */}
        {/* Mobile: Stacked & Auto Height. Desktop: Side-by-Side & Fixed Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px] lg:h-[calc(100vh-200px)]">
          
          {/* LEFT: Inputs */}
          <div className="flex flex-col gap-4 h-full lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <input
              type="text"
              placeholder="Title of the Log"
              value={title}
              onChange={handleTitleChange}
              className="bg-zinc-900 border border-white/10 p-4 rounded text-lg md:text-xl font-bold text-white focus:border-cyan-500 focus:outline-none placeholder:text-gray-600 transition-colors w-full"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="slug-url-auto-gen"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-zinc-900 border border-white/10 p-3 rounded text-sm text-cyan-600 font-mono focus:border-cyan-500 focus:outline-none placeholder:text-gray-600"
              />
              <input
                type="text"
                placeholder="Tags (Optional)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-zinc-900 border border-white/10 p-3 rounded text-sm text-cyan-600 font-mono focus:border-cyan-500 focus:outline-none placeholder:text-gray-600"
              />
            </div>

            <textarea
              placeholder="Short Summary for SEO..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="bg-zinc-900 border border-white/10 p-3 rounded text-sm text-gray-300 h-24 focus:border-cyan-500 focus:outline-none resize-none placeholder:text-gray-600"
            />

            <div className="flex-1 relative group min-h-[300px]">
              <textarea
                placeholder="Initialize markdown content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-zinc-900 border border-white/10 p-4 rounded text-gray-300 font-mono text-sm focus:border-cyan-500 focus:outline-none resize-none placeholder:text-gray-600 leading-relaxed"
              />
              
              {/* Image Upload Button */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImg}
                    className="bg-black/80 hover:bg-cyan-900 border border-white/20 hover:border-cyan-500 p-2 rounded text-gray-400 hover:text-cyan-400 transition-all flex items-center gap-2 text-xs font-mono uppercase backdrop-blur-sm"
                >
                    {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                    {uploadingImg ? '...' : 'Attach Img'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview (Hidden on Mobile) */}
          <div className="hidden lg:block bg-zinc-900/50 border border-white/10 rounded p-6 overflow-y-auto prose prose-invert prose-cyan max-w-none custom-scrollbar">
            {title ? (
              <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
                {title}
              </h1>
            ) : (
              <h1 className="text-gray-700 select-none">Preview Mode</h1>
            )}
            
            {content ? (
              <div className="text-gray-300">
                <ReactMarkdown 
                    components={{
                        img: ({node, ...props}) => (
                            <img {...props} className="rounded border border-cyan-900/50 shadow-lg shadow-cyan-900/20 max-h-[400px] object-cover" />
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-800 font-mono text-sm select-none">
                <p>_WAITING_FOR_DATA_STREAM</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}