import mongoose from 'mongoose';
import { TokenModel } from './token.model';

const tokenBlackListScheme = new mongoose.Schema<TokenModel>({
  refreshToken: { type: String, required: true },
});

export const TokenBlackListScheme = mongoose.model(
  'blackList',
  tokenBlackListScheme,
);
