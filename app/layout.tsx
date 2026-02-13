import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import SessionWrapper from '@/components/SessionWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Dennis Kithinji | Cybersecurity Engineer',
  description: 'Securing the Digital Frontier.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-black text-gray-200 antialiased font-sans selection:bg-cyan-500/30">
        <SessionWrapper>
          {/* Background Effects */}
          <div className="fixed inset-0 z-[-2] h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_800px_at_50%_200px,#00000000,transparent),radial-gradient(circle_at_center,#00000000,#000000ff)] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            {/* 
              FIX APPLIED HERE: 
              Changed pt-0 to pt-24 (approx 96px). 
              This prevents the hero section from sliding under the fixed Navbar.
            */}
            <main className="grow pt-24 pb-10"> 
               {children}
            </main>
            
            <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm font-mono">
               © {new Date().getFullYear()} Dennis Kithinji. All Systems Operational.
            </footer>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}