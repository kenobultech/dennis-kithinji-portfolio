'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, // Added for Demo Link
  Shield, 
  Activity, 
  Terminal, 
  Loader2,
  Cpu 
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!slug) return;
    
    // Fetch project data
    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${slug}`);
            const data = await res.json();
            if (data && !data.error) {
                setProject(data);
            }
        } catch (error) {
            console.error("Failed to load project", error);
        } finally {
            setLoading(false);
        }
    }

    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyan-500 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <div className="font-mono text-sm animate-pulse">Retrieving Data Packet...</div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-black text-white p-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-500 font-mono">Project manifest not found in archive.</p>
        <Link href="/projects" className="mt-8 text-cyan-500 hover:underline">Return to Database</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation */}
        <Link href="/projects" className="group inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-8 font-mono text-sm transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          // Return_to_Archive
        </Link>

        {/* HERO SECTION */}
        <header className="mb-16 border-b border-white/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
                        {project.title}
                    </h1>
                    <div className="inline-block bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider mb-4">
                        {project.status || 'Public'} Release
                    </div>
                    <p className="text-xl text-gray-400 font-light max-w-2xl">
                        {project.shortDescription}
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-lg hover:bg-cyan-400 transition-colors font-bold text-sm">
                            <Github size={18} /> Source_Code
                        </a>
                    )}
                    {project.demoLink && (
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#111] border border-white/20 text-white px-5 py-3 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm">
                            <ExternalLink size={18} /> Live_Demo
                        </a>
                    )}
                </div>
            </div>
            
            {/* Long Description */}
            <div className="mt-8 text-gray-300 text-lg leading-relaxed max-w-4xl whitespace-pre-line border-l-2 border-cyan-900/50 pl-6">
                {project.longDescription}
            </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* How It Works */}
                {project.howItWorks && project.howItWorks.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Activity className="text-cyan-500" /> System Architecture
                    </h2>
                    <div className="bg-[#0a0a0a] border border-white/10 p-1 rounded-xl">
                        <div className="bg-cyber-black rounded-lg p-6">
                            <ul className="space-y-6">
                                {project.howItWorks.map((step: string, i: number) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded bg-cyan-900/20 text-cyan-400 font-mono text-sm border border-cyan-500/20">
                                            {i+1}
                                        </span>
                                        <span className="text-gray-300 mt-1">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                )}

                {/* Features (If you add them later, this handles it safely) */}
                {project.features && project.features.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="text-cyan-500" /> Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.features.map((f: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded border border-white/5 hover:border-white/20 transition-colors">
                                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-400">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* --- UPDATED INSTALLATION SECTION --- */}
                {project.installation && project.installation.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Terminal className="text-cyan-500" /> Installation Protocols
                    </h2>
                    
                    {/* Terminal Window UI */}
                    <div className="bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden font-mono text-sm shadow-2xl">
                        {/* Terminal Header */}
                        <div className="bg-white/5 border-b border-white/5 p-2 flex items-center justify-between">
                            <div className="flex gap-2 ml-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-xs text-gray-600 mr-2">bash — {project.slug}</div>
                        </div>
                        
                        {/* Terminal Content */}
                        <div className="p-6 space-y-6">
                            {project.installation.map((step: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="text-gray-500 select-none mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                       <span className="text-cyan-800">#</span> 
                                       {step.title}
                                    </div>
                                    <div className="flex gap-3 items-center bg-black/50 p-3 rounded border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                        <span className="text-cyan-700 select-none">$</span>
                                        <code className="text-cyan-400 flex-1 break-all">{step.command}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                )}
            </div>

            {/* Right Column (Tech Stack & Tags) */}
            <div className="space-y-8">
                
                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg sticky top-24">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Cpu size={16} /> Tech Stack
                        </h3>
                        <div className="space-y-4">
                            {project.techStack.map((t: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="text-white font-bold group-hover:text-cyan-400 transition-colors">{t.name}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono border-l-2 border-white/10 pl-2 group-hover:border-cyan-500/50 transition-colors">
                                        {t.useCase}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                                #{tag}
                            </span>
                        ))}
                     </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
}