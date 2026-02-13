import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  
  // Links
  githubLink: { type: String },
  demoLink: { type: String },

  // Metadata
  status: { type: String, default: 'Public' },
  tags: [String],
  
  howItWorks: [String],
  features: [{
    title: String,
    description: String
  }],
  techStack: [{
    name: String,
    useCase: String,
    color: String
  }],

  // --- UPDATED SECTION ---
  // Changed from a fixed object to an Array of Objects
  installation: [{
    title: String,   // e.g., "Clone Repository"
    command: String  // e.g., "git clone https://..."
  }],
  // -----------------------
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);