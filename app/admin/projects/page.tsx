'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Edit, X } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormState());

  // Fetch Projects on Load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (parent: string, key: string, value: string) => {
    setFormData({ ...formData, [parent]: { ...formData[parent], [key]: value } });
  };

  // Helper for Arrays (Tags, HowItWorks)
  const handleArrayChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value.split(',').map(item => item.trim()) });
  };
  
  // Helper for Array of Objects (TechStack)
  const addTechStack = () => {
    setFormData({ ...formData, techStack: [...formData.techStack, { name: '', useCase: '' }] });
  };
  const updateTechStack = (index: number, key: string, value: string) => {
    const newStack = [...formData.techStack];
    newStack[index][key] = value;
    setFormData({ ...formData, techStack: newStack });
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/projects/${formData.slug}` : '/api/projects';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Success!');
      setIsEditing(false);
      setFormData(initialFormState());
      fetchProjects();
    } else {
      alert('Error saving project.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/projects/${slug}`, { method: 'DELETE' });
    fetchProjects();
  };

  const editProject = (project: any) => {
    setFormData(project);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-cyan-500">Admin // Projects</h1>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded font-bold text-sm hover:bg-cyan-500">
              <Plus size={16} /> Add New
            </button>
          )}
        </div>

        {/* --- EDIT/CREATE FORM --- */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="bg-gray-900/50 p-8 rounded-xl border border-white/10 space-y-6">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-white">Project Details</h2>
                <button type="button" onClick={() => { setIsEditing(false); setFormData(initialFormState()); }} className="text-red-400"><X /></button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Project Title" className="input-field" required />
                <input name="slug" value={formData.slug} onChange={handleInputChange} placeholder="Slug (e.g. afriskana)" className="input-field" required />
            </div>
            <input name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="Short Description (Card)" className="input-field" />
            <textarea name="longDescription" value={formData.longDescription} onChange={handleInputChange} placeholder="Long Description (Detail Page)" className="input-field h-32" />

            {/* Links & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="githubLink" value={formData.githubLink} onChange={handleInputChange} placeholder="GitHub URL" className="input-field" />
                <input name="demoLink" value={formData.demoLink} onChange={handleInputChange} placeholder="Demo URL" className="input-field" />
                <input placeholder="Tags (comma separated)" onBlur={(e) => handleArrayChange('tags', e.target.value)} defaultValue={formData.tags.join(', ')} className="input-field" />
            </div>

            {/* Installation */}
            <h3 className="text-cyan-400 font-mono text-sm mt-4">Installation Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={formData.installation.clone} onChange={(e) => handleNestedChange('installation', 'clone', e.target.value)} placeholder="Git Clone Command" className="input-field" />
                <input value={formData.installation.install} onChange={(e) => handleNestedChange('installation', 'install', e.target.value)} placeholder="Install Command" className="input-field" />
                <input value={formData.installation.run} onChange={(e) => handleNestedChange('installation', 'run', e.target.value)} placeholder="Run Command" className="input-field" />
            </div>

            {/* Tech Stack (Dynamic) */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-cyan-400 font-mono text-sm">Tech Stack</h3>
                    <button type="button" onClick={addTechStack} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">+ Add Tech</button>
                </div>
                {formData.techStack.map((tech: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                        <input value={tech.name} onChange={(e) => updateTechStack(idx, 'name', e.target.value)} placeholder="Name (e.g. Python)" className="input-field" />
                        <input value={tech.useCase} onChange={(e) => updateTechStack(idx, 'useCase', e.target.value)} placeholder="Use Case (e.g. Backend)" className="input-field" />
                    </div>
                ))}
            </div>
            
            {/* How It Works (Simple Text Area split by pipe) */}
             <div className="space-y-2">
                 <h3 className="text-cyan-400 font-mono text-sm">How It Works Steps (Separate by | )</h3>
                 <textarea 
                    defaultValue={formData.howItWorks.join(' | ')} 
                    onBlur={(e) => setFormData({...formData, howItWorks: e.target.value.split('|').map(s => s.trim())})}
                    className="input-field h-24"
                    placeholder="Step 1 | Step 2 | Step 3" 
                 />
             </div>

            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded font-bold text-white transition-colors">
                <Save className="inline mr-2" size={18} /> Save Project
            </button>
          </form>
        ) : (
          
          /* --- LIST VIEW --- */
          <div className="grid gap-4">
            {projects.map((p) => (
              <div key={p._id} className="bg-[#0a0a0a] border border-white/10 p-4 rounded flex justify-between items-center group hover:border-cyan-500/30">
                <div>
                    <h3 className="font-bold text-lg text-white">{p.title}</h3>
                    <div className="text-xs text-gray-500 font-mono">{p.slug}</div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => editProject(p)} className="p-2 text-cyan-400 hover:bg-cyan-900/30 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.slug)} className="p-2 text-red-400 hover:bg-red-900/30 rounded"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      
      {/* Admin specific styles */}
      <style jsx>{`
        .input-field {
            width: 100%;
            background: #000;
            border: 1px solid #333;
            color: white;
            padding: 10px;
            border-radius: 6px;
            font-size: 14px;
        }
        .input-field:focus {
            border-color: #06b6d4;
            outline: none;
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