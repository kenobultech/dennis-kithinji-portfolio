'use client';

import { useState, useEffect } from 'react';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// --- TYPES ---
interface ResumeData {
  name: string;
  title: string;
  summary: string;
  email: string;
  location: string;
  socials?: { linkedin?: string; github?: string; website?: string };
  skills: { category: string; items: string[] }[];
  experience: { role: string; company: string; period: string; description: string[] }[];
  education: { degree: string; school: string; year: string }[];
  certifications: string[];
}

export default function ResumePage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch('/api/resume');
        const jsonData = await res.json();
        if (jsonData && jsonData.name) {
          setData(jsonData);
        }
      } catch (error) {
        console.error("Failed to fetch resume", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500">
        <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );
  
  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">No Data Found</div>;

  return (
    <div className="min-h-screen bg-black relative py-8 md:py-12 px-0 md:px-4 overflow-x-hidden font-sans">
      
      {/* --- BACKGROUND GLOW --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* --- CONTROLS --- */}
      <div className="fixed top-4 left-4 z-50 print:hidden">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors bg-black/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
            <ArrowLeft size={16} /> <span className="text-xs md:text-sm font-mono">Back</span>
        </Link>
      </div>

      <button 
        onClick={handlePrint}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-cyan-600 text-black hover:bg-cyan-400 p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all print:hidden z-50 flex items-center gap-2 font-bold text-sm"
      >
        <Printer size={20} /> <span className="hidden md:inline">Print PDF</span>
      </button>

      {/* --- DOCUMENT CONTAINER --- */}
      <div 
        id="resume-document"
        className="relative z-10 mx-auto bg-white text-black shadow-2xl w-[95%] md:w-[210mm] rounded-sm md:rounded-none"
        style={{ 
            minHeight: '297mm',
            boxShadow: '0 0 50px -10px rgba(0,0,0,0.8), 0 0 2px rgba(255,255,255,0.5)' 
        }} 
      >
        <div className="resume-content p-6 md:p-[25px_35px]">
            
            {/* --- HEADER --- */}
            <header className="text-center mb-6 md:mb-4">
            <h1 className="text-[24px] md:text-[26px] font-bold uppercase tracking-wide text-black leading-none mb-1">
                {data.name}
            </h1>
            <p className="text-[14px] md:text-[15px] text-gray-800 font-medium mb-2">
                {data.title}
            </p>
            
            <hr className="border-t border-gray-300 my-3 md:my-2" />

            <div className="contact-grid flex flex-col md:flex-row justify-between text-[12px] leading-tight gap-3 md:gap-0">
                <div className="space-y-1 md:space-y-0.5 text-center md:text-left">
                    <div><span className="font-bold">Address: </span>{data.location}</div>
                    <div><span className="font-bold">Phone: </span>+254 790181652</div>
                    <div><span className="font-bold">Email: </span><a href={`mailto:${data.email}`} className="text-blue-800 underline">{data.email}</a></div>
                </div>

                <div className="space-y-1 md:space-y-0.5 text-center md:text-right">
                    {data.socials?.linkedin && (
                        <div>
                            <span className="font-bold">LinkedIn: </span>
                            <a href={`https://${data.socials.linkedin}`} className="text-blue-800 underline break-all md:break-normal">
                                {data.socials.linkedin}
                            </a>
                        </div>
                    )}
                    {data.socials?.github && (
                        <div>
                            <span className="font-bold">GitHub: </span>
                            <a href={`https://${data.socials.github}`} className="text-blue-800 underline break-all md:break-normal">
                                {data.socials.github}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            </header>

            {/* --- SUMMARY --- */}
            <section className="mb-4 md:mb-3">
            <h2 className="text-[14px] font-bold text-black uppercase mb-1 border-b border-gray-200">Summary</h2>
            <p className="text-[12px] leading-[1.4] md:leading-[1.3] text-justify text-gray-900">
                {data.summary}
            </p>
            </section>

            {/* --- EXPERIENCE --- */}
            <section className="mb-4 md:mb-3">
            <h2 className="text-[14px] font-bold text-black uppercase mb-1 border-b border-gray-200">Professional Experience & Projects</h2>
            
            <div className="space-y-4 md:space-y-2.5">
                {data.experience.map((job, idx) => (
                <div key={idx} className="experience-item">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1 md:mb-0.5">
                        <div className="text-[13px] text-black font-bold">
                            {job.company} <span className="font-normal italic text-[12px]">- {job.role}</span>
                        </div>
                        <div className="text-[11px] text-gray-700 italic md:ml-2">
                            {job.period}
                        </div>
                    </div>
                    
                    <ul className="list-disc ml-4 space-y-1 md:space-y-0.5">
                    {job.description.map((point, i) => (
                        <li key={i} className="text-[12px] text-gray-900 leading-[1.3] md:leading-[1.2] pl-0.5 marker:text-gray-500">
                        {point}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            </section>

            {/* --- EDUCATION --- */}
            <section className="mb-4 md:mb-3">
            <h2 className="text-[14px] font-bold text-black uppercase mb-1 border-b border-gray-200">Education</h2>
            {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline mb-1">
                    <div>
                        <div className="text-[13px] font-bold text-black">{edu.school}</div>
                        <div className="text-[12px] text-gray-800">{edu.degree}</div>
                    </div>
                    <div className="text-[11px] text-gray-700 italic">{edu.year}</div>
                </div>
            ))}
            </section>

            {/* --- CERTIFICATIONS --- */}
            <section className="mb-4 md:mb-3">
            <h2 className="text-[14px] font-bold text-black uppercase mb-1 border-b border-gray-200">Professional Certification</h2>
            <ul className="list-disc ml-4 space-y-0.5">
                {data.certifications.map((cert, idx) => (
                <li key={idx} className="text-[12px] text-gray-900 pl-0.5 leading-[1.2]">
                    {cert}
                </li>
                ))}
            </ul>
            </section>

            {/* --- SKILLS --- */}
            <section className="mb-0">
            <h2 className="text-[14px] font-bold text-black uppercase mb-1 border-b border-gray-200">Skills</h2>
            <ul className="list-disc ml-4 space-y-0.5">
                {data.skills.map((skillGroup, idx) => (
                <li key={idx} className="text-[12px] text-gray-900 pl-0.5 leading-[1.2]">
                    <span className="font-bold text-black">{skillGroup.category}:</span> {skillGroup.items.join(', ')}.
                </li>
                ))}
            </ul>
            </section>

        </div>
      </div>

      {/* --- CSS FOR 1-PAGE PRINTING --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        body { font-family: 'Arimo', sans-serif; }

        @media print {
            @page {
                size: A4;
                /* Tight margins to maximize space */
                margin: 0.6cm; 
            }
            html, body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
                height: 100%;
                overflow: hidden; 
            }
            button, nav, footer, .fixed, .print:hidden { display: none !important; }
            
            #resume-document {
                background: white !important;
                color: black !important;
                box-shadow: none !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                border: none !important;
                /* Optional: Slight scale down if it is STILL barely cutting off */
                /* transform: scale(0.98); */
                /* transform-origin: top center; */
            }

            /* --- FORCE TIGHTER SPACING IN PRINT --- */
            
            /* Reduce padding inside the white sheet */
            .resume-content {
                padding: 0 !important; 
            }

            /* Headers */
            h1 { font-size: 22px !important; margin-bottom: 2px !important; }
            h2 { 
                font-size: 13px !important; 
                margin-top: 8px !important; 
                margin-bottom: 4px !important; 
                padding-bottom: 0px !important;
                border-bottom: 1px solid #ddd !important;
            }

            /* Reduce gap between sections (was mb-4) */
            section { margin-bottom: 8px !important; }

            /* Reduce text size slightly for print */
            p, li, span, div { font-size: 11px !important; line-height: 1.25 !important; }
            
            /* Tighten lists */
            ul { margin-bottom: 0 !important; padding-left: 14px !important; }
            li { margin-bottom: 1px !important; }

            /* Experience items spacing */
            .experience-item { margin-bottom: 6px !important; }
            .space-y-4 { space-y: 0 !important; }

            /* Header Contacts */
            header { mb: 10px !important; }
            hr { margin: 5px 0 !important; }

            /* Force Desktop Layout for Contacts */
            .contact-grid {
                display: flex !important;
                flex-direction: row !important;
                justify-content: space-between !important;
                text-align: left !important;
            }
            .contact-grid > div:last-child {
                text-align: right !important;
            }
            .contact-grid a { word-break: normal !important; text-decoration: none !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}