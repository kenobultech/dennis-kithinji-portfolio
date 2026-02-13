// src/components/TerminalWindow.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalLine {
  id: number;
  text: string;
  type: 'command' | 'output' | 'success' | 'info';
}

const BOOT_SEQUENCE = [
  { text: '> whoami', type: 'command', delay: 500 },
  { text: 'Dennis Kithinji', type: 'output', delay: 900 },
  { text: '> role --verbose', type: 'command', delay: 1500 },
  { text: 'Cybersecurity Engineer | Penetration Tester', type: 'output', delay: 2000 },
  { text: '> location', type: 'command', delay: 2800 },
  { text: 'Kilifi, Kenya (Available Remote)', type: 'output', delay: 3300 },
  { text: '> run_portfolio.sh', type: 'command', delay: 4200 },
  { text: '[+] Initializing core modules...', type: 'info', delay: 4800 },
  { text: '[+] Loading project assets...', type: 'info', delay: 5300 },
  { text: '[+] Security protocols... ACTIVE', type: 'success', delay: 6000 },
];

export default function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    // Reset lines on mount
    setLines([]);

    BOOT_SEQUENCE.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            id: index,
            text: line.text,
            type: line.type as 'command' | 'output' | 'success' | 'info',
          },
        ]);
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden shadow-2xl shadow-cyan-900/10 font-mono text-sm sm:text-base"
    >
      {/* Terminal Header */}
      <div className="bg-[#151515] px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs text-gray-500">dennis@kali:~</div>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="p-6 h-[320px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-800"
      >
        {lines.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.type === 'command' && (
              <span className="text-green-400 font-bold mr-2">➜ ~</span>
            )}
            
            <span
              className={`
                ${line.type === 'command' ? 'text-white' : ''}
                ${line.type === 'output' ? 'text-gray-400' : ''}
                ${line.type === 'info' ? 'text-cyan-400' : ''}
                ${line.type === 'success' ? 'text-green-400' : ''}
              `}
            >
              {line.text}
            </span>
          </div>
        ))}
        
        {/* Blinking Cursor */}
        <div className="mt-2">
          <span className="text-green-400 font-bold mr-2">➜ ~</span>
          <span className="w-2.5 h-5 bg-gray-400 inline-block align-middle animate-pulse"></span>
        </div>
      </div>
    </motion.div>
  );
}