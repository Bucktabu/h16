import mongoose from 'mongoose';
import { BanInfoModel } from './banInfo.model';

const banInfoScheme = new mongoose.Schema<BanInfoModel>({
  id: { type: String, required: true },
  isBanned: { type: Boolean, required: true, default: false },
  banDate: { type: Date },
  banReason: { type: String },
});

export const BanInfoScheme = mongoose.model('banInfo', banInfoScheme);
