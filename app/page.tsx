// src/app/page.tsx
import TerminalWindow from '@/components/TerminalWindow';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    // Min-h adjusted to 85vh to center nicely within the layout padding
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-black">
      
      {/* Glow Effect behind the hero content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full z-0" />

      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* LEFT COLUMN: TEXT */}
        <div className="space-y-8 text-center lg:text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-300 tracking-wide uppercase">
              System Online • SOC Analyst Ready
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Defending the <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
                Digital Perimeter
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              I am <strong className="text-white">Dennis Kithinji</strong>. An Information Security Analyst specializing in <span className="text-cyan-400">SOC Operations</span>, Network Defense, and Threat Intelligence. I build resilient infrastructure and hunt vulnerabilities before they are exploited.
            </p>
          </div>

          {/* QUOTE SECTION */}
          <div className="relative pl-6 border-l-4 border-cyan-500/50 py-2 my-8 lg:mx-0 mx-auto max-w-2xl text-left bg-white/5 rounded-r-lg pr-4">
            {/* Quote Icon decorative */}
            <span className="absolute -top-4 -left-3 text-6xl text-cyan-500/20 font-serif">
              &ldquo;
            </span>
            
            <blockquote className="relative z-10 text-lg md:text-xl font-light italic text-gray-300 leading-relaxed">
              Arguing that you don&apos;t care about privacy because you have nothing to hide is like saying you don&apos;t care about free speech because you have nothing to say.
            </blockquote>
            
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px w-12 bg-cyan-500/50"></div>
              <cite className="not-italic text-sm font-mono text-cyan-400 uppercase tracking-widest">
                Edward Snowden
              </cite>
            </div>
          </div>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
             <Link 
               href="/projects" 
               className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded flex items-center gap-2 transition-all"
             >
               View Operations <ArrowRight size={18} />
             </Link>
             <Link 
               href="/about" 
               className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white rounded font-mono transition-all"
             >
               :: Whoami
             </Link>
          </div>

          {/* Stats / Trust Indicators (UPDATED WITH REAL DATA) */}
          <div className="pt-8 grid grid-cols-3 gap-6 border-t border-white/10 mt-8">
            <div>
              <h4 className="text-3xl font-bold text-white">80+</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">LABS COMPLETED</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">1</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">MAJOR PROJECTS</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white">9</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">BADGES EARNED</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL */}
        <div className="relative group hidden lg:block">
           {/* Decorative Grid behind terminal */}
           <div className="absolute -inset-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition duration-1000"></div>
           
           <TerminalWindow />
        </div>

      </div>
    </section>
  );
}