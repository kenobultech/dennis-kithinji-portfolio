import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resume from '@/models/Resume';

const MONGODB_URI = process.env.MONGODB_URI;

// --- DENNIS KITHINJI'S EXTRACTED DATA ---
const SEED_DATA = {
  slug: 'main-resume',
  name: "Dennis Kithinji",
  title: "Information Security Analyst",
  summary: "Telecommunications & IT student passionate about information technology and cybersecurity. A critical thinker and an excellent communicator skilled in networking and security operations. Committed to leveraging hands-on cybersecurity knowledge to support TDB’s goal of world-class governance by securing its digital infrastructure.",
  email: "denniskithinji88@gmail.com",
  location: "Kilifi, Kenya",
  socials: {
    linkedin: "linkedin.com/in/dennis-kithinji",
    github: "github.com/maxdeno"
  },
  skills: [
    { 
      category: "Operating Systems & Logs", 
      items: ["Windows", "Linux", "Wazuh", "rsyslog", "Windows Event Viewer"] 
    },
    { 
      category: "Networking", 
      items: ["Fiber Optic termination", "Huawei router configuration", "Wireshark", "Cisco Packet Tracer"] 
    },
    { 
      category: "Hands-on Labs", 
      items: ["TryHackMe", "Hack the Box"] 
    },
    { 
      category: "Non-Technical", 
      items: ["Public speaking", "Technical Writing", "Leadership", "Problem solving", "Team collaboration"] 
    }
  ],
  experience: [
    {
      role: "Networking Intern",
      company: "Ramcotech Solutions",
      period: "May 2025 - Aug 2025",
      description: [
        "Configured Huawei routers for clients, ensuring seamless authentication with NAC, achieving speeds up to 50 Mbps.",
        "Installed WIFI points for 55 new clients within 1 month, increasing the ISP client base by 8%.",
        "Collaborated with 5 network engineers to restore connections for 5 clients within 3 hours.",
        "Rolled out fiber optic cable in a new area, reducing network troubleshooting to 0."
      ]
    },
    {
      role: "Mentee & Project Lead",
      company: "KamiLimu (Mentorship Program)",
      period: "Mar 2025 - Nov 2025",
      description: [
        "Selected from 100+ applications as one of 36 mentees in Cohort 9.",
        "Built an end-to-end cybersecurity project 'AfriSkana' incorporating responsible computing principles.",
        "Recognized as one of four nominees for the Founder’s Leadership Award.",
        "Graduated with 95.2% session attendance and earned a Leadership certificate of excellence."
      ]
    },
    {
      role: "Personal Project - Developer",
      company: "AfriSkana",
      period: "2025",
      description: [
        "Developed a cybersecurity product that scans for open ports in networks.",
        "Integrated the National Vulnerability Database to display vulnerabilities associated with open ports."
      ]
    },
    {
      role: "Cybersecurity Trainee",
      company: "TryHackMe (Self-Paced)",
      period: "7 Months",
      description: [
        "Completed 78 hands-on rooms and earned 9 badges.",
        "Gained deep understanding of Defending and Attacking concepts in cybersecurity."
      ]
    }
  ],
  education: [
    { 
      degree: "B.Sc. Telecommunications and Information Technology", 
      school: "Pwani University", 
      year: "Sept 2022 - Ongoing" 
    }
  ],
  certifications: [
    "KamiLimu - Certificate of Completion (2025)",
    "Microsoft - Student SOC Program Foundations Training (2025)",
    "IBM Skills Build - Cybersecurity Fundamentals (2024)",
    "Cisco - Introduction to Cybersecurity (2023)"
  ]
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI as string);
};

export async function GET() {
  await connectDB();
  try {
    let resume = await Resume.findOne({ slug: 'main-resume' });
    
    // --- AUTO-SEED LOGIC ---
    // If no resume exists in DB, create Dennis's data automatically
    if (!resume) {
      console.log("Database empty. Seeding Dennis Kithinji's data...");
      resume = await Resume.create(SEED_DATA);
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await connectDB();
  try {
    const data = await request.json();
    const updatedResume = await Resume.findOneAndUpdate(
      { slug: 'main-resume' },
      { ...data, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, data: updatedResume });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}