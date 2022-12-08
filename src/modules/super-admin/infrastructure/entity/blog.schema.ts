import mongoose from 'mongoose';
import { BlogDBModel } from './blog-db.model';

const blogScheme = new mongoose.Schema<BlogDBModel>({
  id: { type: String, required: true },
  userId: { type: String },
  name: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  isBanned: { type: Boolean, default: false}
});

export const BlogSchema = mongoose.model('blogs', blogScheme);
