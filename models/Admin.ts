// models/Admin.ts
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // We removed 'email' entirely to stop the error
}, { timestamps: true });

// Check if model exists, if so, delete it to force re-compile (Fixes hot-reload issues)
if (mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

export default mongoose.model('Admin', AdminSchema);