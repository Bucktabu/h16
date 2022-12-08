import mongoose from 'mongoose';
import { PostDBModel } from './post-db.model';

const postsScheme = new mongoose.Schema<PostDBModel>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const PostsScheme = mongoose.model('posts', postsScheme);
