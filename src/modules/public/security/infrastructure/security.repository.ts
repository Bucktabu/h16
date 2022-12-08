import { SecurityScheme } from './entity/security.scheme';
import { DeviceSecurityModel } from './entity/deviceSecurity.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityRepository {
  async getAllActiveSessions(userId: string) {
    return SecurityScheme.find(
      { userId },
      { projection: { _id: false } },
    ).lean();
  }

  async getDeviseById(deviceId: string) {
    return SecurityScheme.findOne(
      { 'userDevice.deviceId': deviceId },
      { projection: { _id: false } },
    );
  }

  async createUserDevice(createDevice: DeviceSecurityModel) {
    try {
      return SecurityScheme.create(createDevice);
    } catch (e) {
      return null;
    }
  }

  async updateCurrentActiveSessions(
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<boolean> {
    const result = await SecurityScheme.updateOne(
      {
        'userDevice.deviceId': deviceId,
      },
      {
        $set: { 'userDevice.iat': iat, 'userDevice.exp': exp },
      },
    );

    return result.matchedCount === 1;
  }

  async deleteAllActiveSessions(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    try {
      await SecurityScheme.deleteMany({
        userId,
        'userDevice.deviceId': { $ne: deviceId },
      });
      return true;
    } catch (e) {
      console.log('SecurityScheme => deleteAllActiveSessions =>', e);
      return false;
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await SecurityScheme.deleteOne({
      'userDevice.deviceId': deviceId,
    });

    return result.deletedCount === 1;
  }
}
