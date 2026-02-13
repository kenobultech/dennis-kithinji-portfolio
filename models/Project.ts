// src/models/Project.ts
import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., 'afriskana'
  shortDescription: { type: String, required: true }, // For the card view
  longDescription: { type: String, required: true }, // For the detail page hero
  
  // Links
  githubLink: { type: String },
  demoLink: { type: String },

  // Metadata
  status: { type: String, default: 'Public' }, // Public, Private, In Progress
  tags: [String], // ['Python', 'Flask']
  
  // For the Detail Page
  howItWorks: [String], // Array of steps
  features: [{
    title: String,
    description: String
  }],
  techStack: [{
    name: String,
    useCase: String, // e.g., "Backend Server"
    color: String // optional, for the progress bar color
  }],
  installation: {
    clone: String,
    install: String,
    run: String
  },
  
  createdAt: { type: Date, default: Date.now },
});

const Project = models.Project || model('Project', ProjectSchema);

export default Project;