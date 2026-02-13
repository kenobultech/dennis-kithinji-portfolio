'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Github, Shield, Activity, Terminal, Link as LinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!slug) return;
    fetch(`/api/projects/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500"><Loader2 className="animate-spin" /></div>;
  if (!project || project.error) return <div className="min-h-screen bg-black text-white p-20 text-center">Project Not Found</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/projects" className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-300 mb-8 font-mono text-sm">
          <ArrowLeft size={16} /> // Back_to_Archive
        </Link>

        {/* HERO */}
        <header className="mb-16 border-b border-white/10 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">{project.title}</h1>
                    <p className="text-xl text-cyan-400 font-mono">{project.shortDescription}</p>
                </div>
                <div className="flex gap-4">
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 font-bold">
                            <Github size={20} /> Source
                        </a>
                    )}
                </div>
            </div>
            <p className="mt-8 text-gray-400 text-lg leading-relaxed max-w-3xl whitespace-pre-line">{project.longDescription}</p>
        </header>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                
                {/* How It Works */}
                {project.howItWorks?.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-cyan-500" /> How It Works</h2>
                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg text-gray-300">
                        <ul className="space-y-4">
                            {project.howItWorks.map((step: string, i: number) => (
                                <li key={i} className="flex gap-3">
                                    <span className="text-cyan-500 font-mono">0{i+1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                )}

                {/* Features */}
                {project.features?.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="text-cyan-500" /> Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.features.map((f: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded border border-white/5">
                                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-400">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                )}

                {/* Installation */}
                {project.installation && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Terminal className="text-cyan-500" /> Installation</h2>
                    <div className="bg-black border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-500 mb-2"># Clone</div>
                        <div className="text-cyan-400 mb-4">{project.installation.clone || 'git clone ...'}</div>
                        <div className="text-gray-500 mb-2"># Install</div>
                        <div className="text-cyan-400 mb-4">{project.installation.install || 'pip install ...'}</div>
                        <div className="text-gray-500 mb-2"># Run</div>
                        <div className="text-cyan-400">{project.installation.run || 'python app.py'}</div>
                    </div>
                </section>
                )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-8">
                <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg sticky top-24">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">// Tech Stack</h3>
                    <div className="space-y-4">
                        {project.techStack?.map((t: any, i: number) => (
                            <div key={i}>
                                <div className="text-white font-bold">{t.name}</div>
                                <div className="text-xs text-gray-500">{t.useCase}</div>
                                <div className="w-full bg-gray-800 h-1 mt-1 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full w-[70%]"></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}