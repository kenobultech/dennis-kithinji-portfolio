// models/Resume.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ResumeSchema = new Schema({
  slug: { type: String, required: true, unique: true, default: 'main-resume' },
  name: String,
  title: String,
  summary: String,
  email: String,
  location: String,
  socials: {
    linkedin: String,
    github: String,
    website: String,
  },
  skills: [{
    category: String,
    items: [String]
  }],
  experience: [{
    role: String,
    company: String,
    period: String,
    description: [String]
  }],
  education: [{
    degree: String,
    school: String,
    year: String
  }],
  certifications: [String],
  updatedAt: { type: Date, default: Date.now }
});

const Resume = models.Resume || model('Resume', ResumeSchema);

export default Resume;