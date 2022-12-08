import mongoose from 'mongoose';
import { DeviceSecurityModel } from './deviceSecurity.model';

const securityScheme = new mongoose.Schema<DeviceSecurityModel>({
  userId: { type: String, required: true },
  userDevice: {
    deviceId: { type: String, required: true },
    deviceTitle: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    iat: { type: String, required: true },
    exp: { type: String, required: true },
  },
});

export const SecurityScheme = mongoose.model('security', securityScheme);
