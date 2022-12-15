import mongoose from 'mongoose';
import { BanInfoModel } from './banInfo.model';

const banInfoScheme = new mongoose.Schema<BanInfoModel>({
  parentId: { type: String, required: true },
  isBanned: { type: Boolean, required: true, default: false },
  banDate: { type: Date},
  banReason: { type: String },
  blogId: { type: String }, // used when blogger banned user for his blog
  userLogin: { type: String }
});

export const BanInfoScheme = mongoose.model('banInfo', banInfoScheme);
