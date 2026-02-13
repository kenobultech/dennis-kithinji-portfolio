// src/app/about/page.tsx
import Image from 'next/image';
import { BadgeCheck, Shield, Terminal, Users, Cpu } from 'lucide-react';

export const metadata = {
  title: 'About | Dennis Kithinji',
  description: 'Cybersecurity Analyst and SOC Specialist.',
};

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-black pt-24 pb-20 px-6 font-sans text-white">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* --- LEFT: IMAGES (Profile Only) --- */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
                
                {/* 1. Background Glow Effect */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full" />

                {/* 2. Main Profile Picture (Circular) */}
                <div className="relative w-full h-full rounded-full border-4 border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] z-10 group bg-gray-900">
                    <Image 
                        src="/images/dennis-profile-pic.png" 
                        alt="Dennis Kithinji"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Decorative Orbit Line */}
                <div className="absolute -inset-4 border border-dashed border-white/20 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }} />
            </div>
          </div>

          {/* --- RIGHT: BIOGRAPHY --- */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-cyan-400 text-sm font-mono block mb-3 tracking-widest">01. // WHOAMI</span>
              Proactive Defense.<br />
              Strategic Analysis.
            </h1>
            
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p>
                I am a proactive <strong className="text-white">Cybersecurity Analyst</strong> focused on <span className="text-cyan-400">SOC operations</span>, driven by a desire to understand system vulnerabilities and analyze threats. 
              </p>
              <p>
                My skills in Python and log analysis helped me develop <strong className="text-white">AfriSkana</strong>, a web-based port scanner that secured a finalist spot in the KamiLimu Innovation Competition.
              </p>
              <p>
                I am passionate about <span className="text-cyan-400">"Blue Teaming"</span> and aim to protect organizational assets using SIEM and SOAR solutions. I also believe teamwork is essential; collaboration prevents burnout and ensures that threats are quickly neutralized.
              </p>
              <p>
                Whether I am analyzing logs or competing in CTFs, I am always learning to improve the security of digital environments.
              </p>
            </div>

            {/* Quick Stats / Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 rounded text-cyan-400 text-sm font-mono">
                <Shield size={16} /> SOC Operations
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 rounded text-cyan-400 text-sm font-mono">
                <Cpu size={16} /> Python Dev
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/30 border border-cyan-500/30 rounded text-cyan-400 text-sm font-mono">
                <Users size={16} /> Team Leadership
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE SECTION (Remains the same) */}
        <div className="space-y-10 border-t border-white/10 pt-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Terminal className="text-cyan-400" />
            Operational History
          </h2>

          <div className="relative border-l border-white/10 ml-3 space-y-12 pl-8">
            
            {/* Experience 1 */}
            <div className="relative group">
              <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-cyan-500 border-4 border-black group-hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-shadow" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Networking Intern</h3>
                <span className="text-sm font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">
                  May 2025 - Aug 2025
                </span>
              </div>
              <p className="text-gray-400 font-bold mb-2">Ramcotech Solutions</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                <li>Configured Huawei routers ensuring seamless NAC authentication.</li>
                <li>Rolled out fiber optic infrastructure reducing troubleshooting to zero.</li>
                <li>Restored network connectivity for clients within critical timeframes.</li>
              </ul>
            </div>

            {/* Experience 2 */}
            <div className="relative group">
              <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-gray-700 border-4 border-black" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Mentee & Project Lead</h3>
                <span className="text-sm font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                  Mar 2025 - Nov 2025
                </span>
              </div>
              <p className="text-gray-400 font-bold mb-2">KamiLimu Mentorship Program</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                <li>Selected from 100+ applicants for Cohort 9.</li>
                <li>Built "AfriSkana" cybersecurity project, reaching innovation finals.</li>
                <li>Nominee for Founder’s Leadership Award.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}