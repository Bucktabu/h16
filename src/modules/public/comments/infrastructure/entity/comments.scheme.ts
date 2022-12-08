import mongoose from 'mongoose';
import { CommentBDModel } from './commentDB.model';

const commentsScheme = new mongoose.Schema<CommentBDModel>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
});

export const CommentsSchema = mongoose.model('comment', commentsScheme);
