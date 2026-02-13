'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  X
} from 'lucide-react';

// Define the interface for your Post data
interface PostData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string; // This is the database field we need to sync
  tags: string; 
}

// Toast Interface
interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // Refs
  const markdownFileRef = useRef<HTMLInputElement>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [uploadingMarkdown, setUploadingMarkdown] = useState(false); 

  // Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState<PostData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image: '',
    tags: '',
  });

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // 1. Fetch the existing data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setFormData({
            ...data.data,
            tags: data.data.tags ? data.data.tags.join(', ') : '',
          });
        } else {
          showToast('Failed to fetch post data', 'error');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        showToast('Network error while fetching post', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Special handling for Slug to make it URL friendly
    if (name === 'slug') {
      const formattedSlug = value
        .toLowerCase()            
        .replace(/\s+/g, '-')     
        .replace(/[^\w-]/g, '');  

      setFormData((prev) => ({ ...prev, [name]: formattedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 3. Upload Helper (Uses your new /api/upload route)
  const uploadViaApi = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (error) {
      console.error('API upload error:', error);
      return null;
    }
  };

  // 4. Handle Markdown Image Upload (The Important Part)
  const handleMarkdownImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMarkdown(true);
    
    // Upload the file
    const url = await uploadViaApi(file);

    if (url) {
      // 1. Insert into Markdown content
      const imageMarkdown = `\n![${file.name}](${url})\n`;
      
      // 2. Update State
      setFormData((prev) => ({
        ...prev,
        content: prev.content + imageMarkdown,
        image: url // <--- AUTOMATICALLY SYNC THE DB IMAGE FIELD HERE
      }));

      showToast('Image uploaded & synced successfully', 'success');
    } else {
      showToast('Failed to upload image', 'error');
    }

    setUploadingMarkdown(false);
    // Reset input so you can upload the same file again if needed
    if (markdownFileRef.current) markdownFileRef.current.value = '';
  };

  // 5. Submit Updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare Payload
    const payload = {
      ...formData,
      // Ensure tags are an array
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter((t) => t !== ''),
    };

    // Update Database
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        showToast('System Log updated successfully. Redirecting...', 'success');
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1500);
      } else {
        showToast(`Update Failed: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      showToast('Critical Error: Failed to connect to server', 'error');
    }
  };

  if (loading) return <div className="text-white p-10 font-mono">Loading database entry...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans relative">
      
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border backdrop-blur-md shadow-2xl animate-in slide-in-from-top-5 fade-in ${
          toast.type === 'success' ? 'bg-green-950/30 border-green-500/50 text-green-400' : 'bg-red-950/30 border-red-500/50 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <div className="flex flex-col">
            <span className="font-bold font-mono uppercase text-xs tracking-wider">{toast.type === 'success' ? 'Success' : 'Error'}</span>
            <span className="text-sm">{toast.message}</span>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      )}

      <div className="max-w-4xl mx-auto border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Edit System Log (Post)</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-gray-400 mb-2 font-mono text-sm">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/20 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Slug & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-gray-400 mb-2 font-mono text-sm">Slug (URL)</label>
                <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/20 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                required
                />
            </div>
            <div>
                <label className="block text-gray-400 mb-2 font-mono text-sm">Tags (comma separated)</label>
                <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-[#111] border border-white/20 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-gray-400 mb-2 font-mono text-sm">Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#111] border border-white/20 rounded p-3 text-white focus:border-cyan-500 outline-none transition-colors"
              required
            />
          </div>

          {/* Content */}
          <div className="relative group">
            <div className="flex justify-between items-end mb-2">
                <label className="block text-gray-400 font-mono text-sm">Content (Markdown)</label>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                    To update image: delete old line, upload new.
                </span>
            </div>
            
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={18}
              className="w-full bg-[#111] border border-white/20 rounded p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors leading-relaxed"
              required
            />

            {/* FLOATING UPLOAD BUTTON */}
            <div className="absolute bottom-4 right-4 z-10">
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={markdownFileRef}
                    onChange={handleMarkdownImageUpload}
                />
                <button
                    type="button"
                    onClick={() => markdownFileRef.current?.click()}
                    disabled={uploadingMarkdown}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-cyan-900/80 text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all text-xs font-mono uppercase shadow-xl backdrop-blur-sm"
                >
                    {uploadingMarkdown ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                    {uploadingMarkdown ? 'Uploading...' : 'Insert New Image'}
                </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={uploadingMarkdown}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              {uploadingMarkdown ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
              Update Database
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-gray-400 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}