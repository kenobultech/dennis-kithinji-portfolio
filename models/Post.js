import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    type: String,
    required: true,
    maxlength: [200, 'Summary cannot be more than 200 characters'],
  },
  content: {
    type: String, // We will store Markdown string here
    required: true,
  },
  image: {
    type: String, // URL from Cloudinary
  },
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);