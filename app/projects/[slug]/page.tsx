'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
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
    <div className="min-h-screen bg-black text-white p-10 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-500 font-mono">Project manifest not found.</p>
        <Link href="/projects" className="mt-8 text-cyan-500 hover:underline">Return to Database</Link>
    </div>
  );

  return (
    // Outer container with overflow-x-hidden prevents any horizontal scrollbars on the body
    <div className="min-h-screen bg-black text-white font-sans pt-24 pb-20 px-4 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Navigation */}
        <Link href="/projects" className="group inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-8 font-mono text-sm transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          // Return_to_Archive
        </Link>

        {/* HERO SECTION */}
        <header className="mb-12 border-b border-white/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                
                {/* Text Content */}
                <div className="w-full lg:w-2/3">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white wrap-break-word">
                        {project.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="inline-block bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider">
                            {project.status || 'Public'} Release
                        </div>
                    </div>

                    <p className="text-lg sm:text-xl text-gray-400 font-light max-w-2xl wrap-break-word">
                        {project.shortDescription}
                    </p>
                </div>
                
                {/* Action Buttons - Stack on mobile, Row on desktop */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                    {project.githubLink && (
                        <a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-cyan-400 transition-colors font-bold text-sm w-full sm:w-auto"
                        >
                            <Github size={18} /> 
                            <span>Source_Code</span>
                        </a>
                    )}
                    {project.demoLink && (
                        <a 
                            href={project.demoLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 bg-[#111] border border-white/20 text-white px-6 py-3 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm w-full sm:w-auto"
                        >
                            <ExternalLink size={18} /> 
                            <span>Live_Demo</span>
                        </a>
                    )}
                </div>
            </div>
            
            {/* Long Description */}
            <div className="mt-8 text-gray-300 text-base sm:text-lg leading-relaxed max-w-4xl whitespace-pre-line wrap-break-word border-l-2 border-cyan-900/50 pl-4 sm:pl-6">
                {project.longDescription}
            </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* SYSTEM ARCHITECTURE (HOW IT WORKS) - FIXED OVERFLOW HERE */}
                {project.howItWorks && project.howItWorks.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Activity className="text-cyan-500" /> System Architecture
                    </h2>
                    <div className="bg-[#0a0a0a] border border-white/10 p-1 rounded-xl">
                        <div className="bg-[#111] rounded-lg p-4 sm:p-6">
                            <ul className="space-y-6">
                                {project.howItWorks.map((step: string, i: number) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        {/* Number Badge (Shrink-0 prevents it from getting squashed) */}
                                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded bg-cyan-900/20 text-cyan-400 font-mono text-sm border border-cyan-500/20">
                                            {i+1}
                                        </span>
                                        
                                        {/* The Text Content - Fixed with min-w-0 and break-words */}
                                        <span className="text-gray-300 mt-1 text-sm sm:text-base flex-1 min-w-0 wrap-break-word">
                                            {step}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                )}

                {/* Features */}
                {project.features && project.features.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="text-cyan-500" /> Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.features.map((f: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded border border-white/5 hover:border-white/20 transition-colors">
                                <h3 className="font-bold text-white mb-2 wrap-break-word">{f.title}</h3>
                                <p className="text-sm text-gray-400 wrap-break-word">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Installation Section */}
                {project.installation && project.installation.length > 0 && (
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                        <Terminal className="text-cyan-500" /> Installation
                    </h2>
                    
                    {/* Terminal Window */}
                    <div className="bg-[#0c0c0c] border border-white/10 rounded-lg overflow-hidden font-mono text-sm shadow-2xl max-w-full">
                        {/* Terminal Header */}
                        <div className="bg-white/5 border-b border-white/5 p-2 flex items-center justify-between">
                            <div className="flex gap-2 ml-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-600 mr-2">bash — {project.slug}</div>
                        </div>
                        
                        {/* Terminal Content - horizontal scroll enabled for code blocks */}
                        <div className="p-4 sm:p-6 space-y-6 overflow-x-auto">
                            {project.installation.map((step: any, i: number) => (
                                <div key={i} className="group min-w-0">
                                    <div className="text-gray-500 select-none mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                       <span className="text-cyan-800">#</span> 
                                       {step.title}
                                    </div>
                                    <div className="flex gap-3 items-center bg-black/50 p-3 rounded border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                        <span className="text-cyan-700 select-none">$</span>
                                        <code className="text-cyan-400 flex-1 whitespace-pre-wrap break-all text-xs sm:text-sm">
                                            {step.command}
                                        </code>
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
                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg lg:sticky lg:top-24">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Cpu size={16} /> Tech Stack
                        </h3>
                        <div className="space-y-4">
                            {project.techStack.map((t: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="text-white font-bold group-hover:text-cyan-400 transition-colors wrap-break-word">{t.name}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono border-l-2 border-white/10 pl-2 group-hover:border-cyan-500/50 transition-colors wrap-break-word">
                                        {t.useCase}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="text-xs font-bold text-gray-600 uppercase mb-3">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}