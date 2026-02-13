'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Edit, X, FolderOpen, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';

// --- TOAST TYPES ---
type ToastType = 'success' | 'error' | null;
interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: null });

  // Form State
  const [formData, setFormData] = useState<any>(initialFormState());

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- NOTIFICATION HANDLER ---
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000); // Disappears after 4 seconds
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      showToast('Failed to fetch projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (parent: string, key: string, value: string) => {
    setFormData({ ...formData, [parent]: { ...formData[parent], [key]: value } });
  };

  const handleArrayChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value.split(',').map(item => item.trim()) });
  };
  
  const addTechStack = () => {
    setFormData({ ...formData, techStack: [...formData.techStack, { name: '', useCase: '' }] });
  };
  
  const updateTechStack = (index: number, key: string, value: string) => {
    const newStack = [...formData.techStack];
    newStack[index][key] = value;
    setFormData({ ...formData, techStack: newStack });
  };

  const removeTechStack = (index: number) => {
     const newStack = formData.techStack.filter((_: any, i: number) => i !== index);
     setFormData({ ...formData, techStack: newStack });
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/projects/${formData.slug}` : '/api/projects';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(formData._id ? 'Project updated successfully' : 'New project created', 'success');
        setIsEditing(false);
        setFormData(initialFormState());
        fetchProjects();
      } else {
        showToast('Server rejected the request', 'error');
      }
    } catch (error) {
      showToast('Connection error occurred', 'error');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Project deleted successfully', 'success');
        fetchProjects();
      } else {
        showToast('Failed to delete project', 'error');
      }
    } catch (error) {
      showToast('Error connecting to server', 'error');
    }
  };

  const editProject = (project: any) => {
    setFormData(project);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 font-sans relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
             <Terminal className="text-cyan-500" />
             <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Admin // Projects</h1>
          </div>
          {!isEditing && (
            <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center gap-2 bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 px-5 py-2.5 rounded-full font-mono text-sm hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            >
              <Plus size={16} /> Init_New_Project
            </button>
          )}
        </div>

        {/* --- EDIT/CREATE FORM --- */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-8 rounded-xl border border-white/10 space-y-6 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-xl" />
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit size={18} className="text-cyan-400"/> Project Editor
                </h2>
                <button type="button" onClick={() => { setIsEditing(false); setFormData(initialFormState()); }} className="text-gray-500 hover:text-white transition-colors"><X /></button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-mono">PROJECT TITLE</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter title..." className="input-field" required />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-mono">UNIQUE SLUG</label>
                    <input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="project-name-v1" className="input-field" required />
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs text-gray-500 font-mono">SHORT DESCRIPTION (CARD)</label>
                <input name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="Brief summary..." className="input-field" />
            </div>
            
            <div className="space-y-1">
                <label className="text-xs text-gray-500 font-mono">FULL DOCUMENTATION (MARKDOWN SUPPORTED)</label>
                <textarea name="longDescription" value={formData.longDescription} onChange={handleInputChange} placeholder="Detailed explanation..." className="input-field h-32" />
            </div>

            {/* Links & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="githubLink" value={formData.githubLink} onChange={handleInputChange} placeholder="GitHub URL" className="input-field" />
                <input name="demoLink" value={formData.demoLink} onChange={handleInputChange} placeholder="Live Demo URL" className="input-field" />
                <input placeholder="Tags (comma separated)" onBlur={(e) => handleArrayChange('tags', e.target.value)} defaultValue={formData.tags.join(', ')} className="input-field" />
            </div>

            {/* Installation */}
            <h3 className="text-cyan-400 font-mono text-sm mt-6 border-b border-white/10 pb-2">Installation Protocols</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={formData.installation.clone} onChange={(e) => handleNestedChange('installation', 'clone', e.target.value)} placeholder="Git Clone..." className="input-field" />
                <input value={formData.installation.install} onChange={(e) => handleNestedChange('installation', 'install', e.target.value)} placeholder="npm install..." className="input-field" />
                <input value={formData.installation.run} onChange={(e) => handleNestedChange('installation', 'run', e.target.value)} placeholder="npm run dev..." className="input-field" />
            </div>

            {/* Tech Stack (Dynamic) */}
            <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/5">
                <div className="flex justify-between items-center">
                    <h3 className="text-cyan-400 font-mono text-sm">Tech Stack</h3>
                    <button type="button" onClick={addTechStack} className="text-xs bg-cyan-900/50 text-cyan-200 border border-cyan-500/30 px-3 py-1 rounded hover:bg-cyan-500 hover:text-black transition-colors">+ Append Node</button>
                </div>
                {formData.techStack.map((tech: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                        <input value={tech.name} onChange={(e) => updateTechStack(idx, 'name', e.target.value)} placeholder="Tech Name" className="input-field flex-1" />
                        <input value={tech.useCase} onChange={(e) => updateTechStack(idx, 'useCase', e.target.value)} placeholder="Usage Context" className="input-field flex-1" />
                        <button type="button" onClick={() => removeTechStack(idx)} className="text-red-500 hover:text-red-400"><X size={14}/></button>
                    </div>
                ))}
            </div>
            
            {/* How It Works */}
             <div className="space-y-2">
                 <h3 className="text-cyan-400 font-mono text-sm">Execution Steps (Delimiter: | )</h3>
                 <textarea 
                    defaultValue={formData.howItWorks.join(' | ')} 
                    onBlur={(e) => setFormData({...formData, howItWorks: e.target.value.split('|').map(s => s.trim())})}
                    className="input-field h-24 font-mono text-xs"
                    placeholder="Initialize Database | Configure Environment | Launch Cluster" 
                 />
             </div>

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded font-bold text-white transition-all hover:tracking-widest shadow-lg shadow-cyan-900/20">
                <Save className="inline mr-2" size={18} /> COMMIT CHANGES
            </button>
          </form>
        ) : (
          
          /* --- LIST VIEW --- */
          <div className="space-y-4">
            {isLoading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Loading Database...</div>
            ) : projects.length === 0 ? (
                /* --- BEAUTIFUL EMPTY STATE PLACEHOLDER --- */
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/10 rounded-2xl bg-[#0a0a0a]/50 text-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                        <div className="relative bg-[#0d0d0d] p-6 rounded-full border border-white/10 text-gray-500">
                            <FolderOpen size={48} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Registry Empty</h3>
                    <p className="text-gray-400 mb-8 max-w-sm font-light">
                        No active projects were found in the database. Initialize your first project to display it on the portfolio.
                    </p>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-cyan-400 transition-all"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                        Create Entry
                    </button>
                </div>
            ) : (
                /* --- PROJECT LIST --- */
                <div className="grid gap-4">
                    {projects.map((p) => (
                    <div key={p._id} className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex justify-between items-center group hover:border-cyan-500/50 hover:bg-white/5 transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 mt-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                                <div className="text-xs text-gray-500 font-mono mt-1 flex gap-2">
                                    <span>id: {p.slug}</span>
                                    <span className="text-gray-700">|</span>
                                    <span>stack: {p.techStack?.length || 0} items</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => editProject(p)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(p.slug)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors" title="Delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
          </div>
        )}

      </div>

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ease-in-out ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
         <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border shadow-2xl backdrop-blur-md min-w-[300px] ${
            toast.type === 'success' 
            ? 'bg-black/90 border-green-500/50 text-green-400' 
            : 'bg-black/90 border-red-500/50 text-red-400'
         }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wider">{toast.type === 'success' ? 'System Success' : 'System Error'}</span>
                <span className="text-xs text-gray-400 font-mono">{toast.message}</span>
            </div>
            <button onClick={() => setToast({...toast, show: false})} className="ml-auto hover:text-white"><X size={14} /></button>
         </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .input-field {
            width: 100%;
            background: #000;
            border: 1px solid #333;
            color: white;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        .input-field:focus {
            border-color: #06b6d4;
            outline: none;
            background: #050505;
        }
      `}</style>
    </div>
  );
}

// Initial State Helper
function initialFormState() {
    return {
        title: '', slug: '', shortDescription: '', longDescription: '',
        status: 'Public', tags: [],
        githubLink: '', demoLink: '',
        howItWorks: [], features: [],
        techStack: [],
        installation: { clone: '', install: '', run: '' }
    };
}