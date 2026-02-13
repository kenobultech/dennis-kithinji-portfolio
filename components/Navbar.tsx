'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, Github, Linkedin } from 'lucide-react';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Resume', href: '/resume' },
];

const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/maxdeno', 
    icon: Github 
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com/in/dennis-kithinji', 
    icon: Linkedin 
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-cyber-black/80 backdrop-blur-md border-white/10 py-3' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
            <Shield className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-white">
            DENNIS<span className="text-cyan-400">.</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-cyan-400 ${
                  isActive ? 'text-cyan-400' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <span className="absolute -left-3 top-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f3ff]" />
                )}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500/50 mr-1">[</span>
                {link.name}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500/50 ml-1">]</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: SOCIALS */}
        <div className="hidden md:flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
              aria-label={social.name}
            >
              <div className="absolute inset-0 bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <social.icon 
                size={20} 
                className="relative z-10 text-gray-400 group-hover:text-cyan-400 transition-colors" 
              />
            </a>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-mono hover:text-cyan-400 transition-colors ${
                pathname === link.href ? 'text-cyan-400 pl-4 border-l-2 border-cyan-400' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex gap-6 py-4 border-t border-white/10 mt-2 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}