'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert,  ArrowRight, Loader2, FolderSearch, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
            setProjects(data);
        } else {
            setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500"><Loader2 className="animate-spin" /></div>;

  return (
    <section className="min-h-screen pt-24 pb-20 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Mission <span className="text-cyan-400">Archive</span></h1>
            <p className="text-gray-400 mt-4">Showcasing specialized security tools and development projects.</p>
        </div>

        {/* CONTENT AREA */}
        {projects.length > 0 ? (
            // --- GRID VIEW (If projects exist) ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <Link href={`/projects/${project.slug}`} key={project._id}>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group h-full relative bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)] flex flex-col cursor-pointer p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 group-hover:border-cyan-500/20">
                                <ShieldAlert className="w-6 h-6 text-cyan-400" />
                            </div>
                            <span className="text-xs font-mono bg-green-900/20 text-green-400 border border-green-500/20 px-2 py-1 rounded flex items-center gap-1">
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 flex items-center gap-2">
                            {project.title} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500"/>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{project.shortDescription}</p>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                            {project.tags?.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">{tag}</span>
                            ))}
                        </div>
                    </motion.div>
                </Link>
            ))}
            </div>
        ) : (
            // --- PLACEHOLDER VIEW (If no projects) ---
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5"
            >
                <div className="bg-black p-4 rounded-full border border-white/10 mb-6 relative group">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FolderSearch className="w-12 h-12 text-gray-600 group-hover:text-cyan-400 transition-colors relative z-10" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Terminal size={18} className="text-cyan-500" /> 
                    ARCHIVE_EMPTY
                </h3>
                
                <p className="text-gray-400 max-w-md font-mono text-sm leading-relaxed mb-6">
                    No public missions have been declassified yet.<br />
                    System is awaiting new operational data.
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-600 bg-black px-3 py-1 rounded border border-white/10">
                    STATUS: LISTENING_ON_PORT_3000
                </div>
            </motion.div>
        )}

      </div>
    </section>
  );
}