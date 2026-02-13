'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, ArrowLeft, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

// --- TYPES ---
interface ResumeData {
  name: string;
  title: string;
  summary: string;
  email: string;
  location: string;
  socials: { linkedin: string; github: string; website: string };
  skills: { category: string; items: string[] }[];
  experience: { role: string; company: string; period: string; description: string[] }[];
  education: { degree: string; school: string; year: string }[];
  certifications: string[];
}

const emptyResume: ResumeData = {
  name: '', title: '', summary: '', email: '', location: '',
  socials: { linkedin: '', github: '', website: '' },
  skills: [], experience: [], education: [], certifications: []
};

export default function EditResumePage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- TOAST STATE ---
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Helper to show toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // 1. Fetch Data
  useEffect(() => {
    fetch('/api/resume')
      .then((res) => res.json())
      .then((jsonData) => {
        if (jsonData.name) setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast('Failed to load resume data', 'error');
        setLoading(false);
      });
  }, []);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, socials: { ...data.socials, [e.target.name]: e.target.value } });
  };

  const handleSkillChange = (index: number, field: 'category' | 'items', value: string) => {
    const newSkills = [...data.skills];
    if (field === 'category') {
      newSkills[index].category = value;
    } else {
      newSkills[index].items = value.split(',').map(s => s.trim());
    }
    setData({ ...data, skills: newSkills });
  };
  const addSkill = () => setData({ ...data, skills: [...data.skills, { category: '', items: [] }] });
  const removeSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    setData({ ...data, skills: newSkills });
  };

  const handleExpChange = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    // @ts-ignore
    newExp[index][field] = value;
    setData({ ...data, experience: newExp });
  };
  const handleExpDescChange = (index: number, value: string) => {
    const newExp = [...data.experience];
    newExp[index].description = value.split('\n').filter(line => line.trim() !== '');
    setData({ ...data, experience: newExp });
  };
  const addExp = () => setData({ ...data, experience: [...data.experience, { role: '', company: '', period: '', description: [] }] });
  const removeExp = (index: number) => setData({ ...data, experience: data.experience.filter((_, i) => i !== index) });

  const handleEduChange = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    // @ts-ignore
    newEdu[index][field] = value;
    setData({ ...data, education: newEdu });
  };
  const addEdu = () => setData({ ...data, education: [...data.education, { degree: '', school: '', year: '' }] });
  const removeEdu = (index: number) => setData({ ...data, education: data.education.filter((_, i) => i !== index) });

  const handleCertChange = (index: number, value: string) => {
    const newCerts = [...data.certifications];
    newCerts[index] = value;
    setData({ ...data, certifications: newCerts });
  };
  const addCert = () => setData({ ...data, certifications: [...data.certifications, ''] });
  const removeCert = (index: number) => setData({ ...data, certifications: data.certifications.filter((_, i) => i !== index) });

  // --- SAVE ---
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('System Updated Successfully', 'success');
      } else {
        showToast('Update Failed: Server Error', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network Connection Error', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8 font-sans relative">
      
      {/* --- CUSTOM TOAST NOTIFICATION COMPONENT --- */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
          toast.type === 'success' 
            ? 'bg-zinc-900 border-green-500/50 text-green-400 shadow-green-900/20' 
            : 'bg-zinc-900 border-red-500/50 text-red-400 shadow-red-900/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          
          <div className="flex flex-col">
            <span className="font-bold text-sm uppercase tracking-wider">{toast.type === 'success' ? 'Success' : 'Error'}</span>
            <span className="text-xs text-gray-400">{toast.message}</span>
          </div>

          <button onClick={() => setToast(prev => ({...prev, show: false}))} className="ml-4 text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Resume Protocol</h1>
        </div>

        {/* FORM CONTAINER */}
        <div className="space-y-8">
          
          {/* SECTION 1: PERSONAL INFO */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h2 className="text-lg font-bold text-cyan-500 mb-4 border-b border-white/10 pb-2">01. Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                <input name="name" value={data.name} onChange={handleChange} className="w-full bg-black border border-white/20 p-2 rounded text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Job Title</label>
                <input name="title" value={data.title} onChange={handleChange} className="w-full bg-black border border-white/20 p-2 rounded text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input name="email" value={data.email} onChange={handleChange} className="w-full bg-black border border-white/20 p-2 rounded text-white focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Location</label>
                <input name="location" value={data.location} onChange={handleChange} className="w-full bg-black border border-white/20 p-2 rounded text-white focus:border-cyan-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Professional Summary</label>
                <textarea name="summary" rows={4} value={data.summary} onChange={handleChange} className="w-full bg-black border border-white/20 p-2 rounded text-white focus:border-cyan-500 outline-none" />
              </div>
            </div>
            
            {/* Socials Sub-section */}
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-xs text-gray-500 mb-1">LinkedIn URL</label>
                  <input name="linkedin" value={data.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full bg-black border border-white/20 p-2 rounded text-sm text-gray-300" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">GitHub URL</label>
                  <input name="github" value={data.socials?.github || ''} onChange={handleSocialChange} className="w-full bg-black border border-white/20 p-2 rounded text-sm text-gray-300" />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 mb-1">Website URL</label>
                  <input name="website" value={data.socials?.website || ''} onChange={handleSocialChange} className="w-full bg-black border border-white/20 p-2 rounded text-sm text-gray-300" />
               </div>
            </div>
          </div>

          {/* SECTION 2: EXPERIENCE */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h2 className="text-lg font-bold text-cyan-500">02. Experience</h2>
              <button onClick={addExp} className="flex items-center gap-1 text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500 hover:text-black transition-colors"><Plus size={12}/> Add Job</button>
            </div>
            
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded border border-white/10 relative group">
                  <button onClick={() => removeExp(idx)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input placeholder="Role / Title" value={exp.role} onChange={(e) => handleExpChange(idx, 'role', e.target.value)} className="bg-black border border-white/20 p-2 rounded text-white text-sm" />
                    <input placeholder="Company" value={exp.company} onChange={(e) => handleExpChange(idx, 'company', e.target.value)} className="bg-black border border-white/20 p-2 rounded text-white text-sm" />
                    <input placeholder="Period (e.g. 2023 - Present)" value={exp.period} onChange={(e) => handleExpChange(idx, 'period', e.target.value)} className="bg-black border border-white/20 p-2 rounded text-white text-sm" />
                  </div>
                  <textarea 
                    placeholder="Description bullets (one per line)" 
                    rows={4}
                    value={exp.description.join('\n')} 
                    onChange={(e) => handleExpDescChange(idx, e.target.value)} 
                    className="w-full bg-black border border-white/20 p-2 rounded text-white text-sm font-mono" 
                  />
                  <p className="text-[10px] text-gray-500 mt-1">* Separate bullet points with a new line (Enter key)</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: SKILLS */}
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
             <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h2 className="text-lg font-bold text-cyan-500">03. Skills</h2>
              <button onClick={addSkill} className="flex items-center gap-1 text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500 hover:text-black transition-colors"><Plus size={12}/> Add Category</button>
            </div>
            <div className="space-y-4">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/5 p-3 rounded">
                   <div className="flex-1 space-y-2">
                      <input 
                        placeholder="Category (e.g. Networking)" 
                        value={skill.category} 
                        onChange={(e) => handleSkillChange(idx, 'category', e.target.value)} 
                        className="w-full bg-black border border-white/20 p-2 rounded text-cyan-400 font-bold text-sm" 
                      />
                      <textarea 
                        placeholder="Items (comma separated: Linux, Windows, Mac)" 
                        value={skill.items.join(', ')} 
                        onChange={(e) => handleSkillChange(idx, 'items', e.target.value)} 
                        className="w-full bg-black border border-white/20 p-2 rounded text-gray-300 text-sm h-20" 
                      />
                   </div>
                   <button onClick={() => removeSkill(idx)} className="text-gray-600 hover:text-red-500 mt-2"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: EDUCATION & CERTIFICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Education */}
             <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-lg font-bold text-cyan-500">Education</h2>
                  <button onClick={addEdu} className="text-cyan-400 hover:text-white"><Plus size={18}/></button>
                </div>
                <div className="space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded relative">
                      <button onClick={() => removeEdu(idx)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><Trash2 size={14} /></button>
                      <input placeholder="Degree" value={edu.degree} onChange={(e) => handleEduChange(idx, 'degree', e.target.value)} className="w-full bg-black border border-white/20 p-1.5 rounded text-sm mb-2" />
                      <input placeholder="School" value={edu.school} onChange={(e) => handleEduChange(idx, 'school', e.target.value)} className="w-full bg-black border border-white/20 p-1.5 rounded text-sm mb-2" />
                      <input placeholder="Year" value={edu.year} onChange={(e) => handleEduChange(idx, 'year', e.target.value)} className="w-full bg-black border border-white/20 p-1.5 rounded text-sm" />
                    </div>
                  ))}
                </div>
             </div>

             {/* Certifications */}
             <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                  <h2 className="text-lg font-bold text-cyan-500">Certifications</h2>
                  <button onClick={addCert} className="text-cyan-400 hover:text-white"><Plus size={18}/></button>
                </div>
                <div className="space-y-2">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={cert} 
                        onChange={(e) => handleCertChange(idx, e.target.value)} 
                        className="w-full bg-black border border-white/20 p-2 rounded text-sm" 
                        placeholder="Certification Name"
                      />
                      <button onClick={() => removeCert(idx)} className="text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="sticky bottom-6 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2 bg-cyan-600 text-black font-bold px-8 py-3 rounded hover:bg-cyan-500 hover:scale-105 transition-all shadow-lg shadow-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}