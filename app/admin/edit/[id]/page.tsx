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
  image: string;
  tags: string; 
}

// Interface for the Toast State
interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // Refs for file inputs
  const markdownFileRef = useRef<HTMLInputElement>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [uploadingFeature, setUploadingFeature] = useState(false); 
  const [uploadingMarkdown, setUploadingMarkdown] = useState(false); 

  // --- NEW: Toast State ---
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Feature Image Management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<PostData>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    image: '',
    tags: '',
  });

  // --- NEW: Helper to show toast ---
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    // Auto-hide after 4 seconds
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
          if (data.data.image) setImagePreview(data.data.image);
        } else {
          showToast('Failed to fetch post data from database', 'error');
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

  // 2. Handle Text Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  // 4. Helper: Upload to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast('System Error: Cloudinary config missing', 'error');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  // 5. Handle Markdown Inline Image Upload
  const handleMarkdownImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMarkdown(true);
    const url = await uploadToCloudinary(file);

    if (url) {
      const imageMarkdown = `\n![${file.name}](${url})\n`;
      setFormData((prev) => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
      showToast('Image inserted into content successfully', 'success');
    } else {
      showToast('Failed to upload inline image', 'error');
    }

    setUploadingMarkdown(false);
    if (markdownFileRef.current) markdownFileRef.current.value = '';
  };

  // 6. Submit Updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = formData.image;

    // A. Upload Feature Image if changed
    if (selectedFile) {
      setUploadingFeature(true);
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      setUploadingFeature(false);

      if (!uploadedUrl) {
        showToast('Feature image upload failed. Aborting save.', 'error');
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // B. Prepare Payload
    const payload = {
      ...formData,
      image: finalImageUrl,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter((t) => t !== ''),
    };

    // C. Update Database
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        showToast('System Log updated successfully. Redirecting...', 'success');
        
        // Wait 1.5s before redirecting so user sees the toast
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
      
      {/* --- CUSTOM TOAST NOTIFICATION COMPONENT --- */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
          toast.type === 'success' 
            ? 'bg-green-950/30 border-green-500/50 text-green-400' 
            : 'bg-red-950/30 border-red-500/50 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <div className="flex flex-col">
            <span className="font-bold font-mono uppercase text-xs tracking-wider">
              {toast.type === 'success' ? 'Success' : 'Error'}
            </span>
            <span className="text-sm">{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))} 
            className="ml-4 opacity-50 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {/* ------------------------------------------- */}

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

          {/* Slug & Tags Row */}
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
                placeholder="security, network, coding"
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

          {/* --- CONTENT (MARKDOWN) WITH IMAGE BUTTON --- */}
          <div className="relative group">
            <label className="block text-gray-400 mb-2 font-mono text-sm">Content (Markdown)</label>
            
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={18}
              className="w-full bg-[#111] border border-white/20 rounded p-4 text-white font-mono text-sm focus:border-cyan-500 outline-none transition-colors leading-relaxed"
              required
            />

            {/* FLOATING MARKDOWN IMAGE BUTTON */}
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
                    title="Insert Image into Markdown"
                >
                    {uploadingMarkdown ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                    {uploadingMarkdown ? 'Uploading...' : 'Insert Image'}
                </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={uploadingFeature || uploadingMarkdown}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              {uploadingFeature ? 'Uploading Cover...' : 'Update Database'}
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