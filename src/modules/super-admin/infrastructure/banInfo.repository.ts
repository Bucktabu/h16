import { BanInfoModel } from './entity/banInfo.model';
import { BanInfoScheme } from './entity/banInfo.scheme';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BanInfoRepository {
  async getBanInfo(id: string): Promise<any> {
    return BanInfoScheme.findOne({ id }, { _id: false, id: false, __v: false });
  }

  async createBanInfo(banInfo: BanInfoModel) {
    try {
      await BanInfoScheme.create(banInfo);
      return banInfo;
    } catch (e) {
      return null;
    }
  }

  async updateBanStatus(id: string, isBanned: boolean, banReason: string, banDate: Date): Promise<boolean> {
    const result = await BanInfoScheme.updateOne({id}, {$set: {isBanned, banReason, banDate}})

    return result.matchedCount === 1
  }

  async deleteBanInfoById(id: string): Promise<boolean> {
    const result = await BanInfoScheme.deleteOne({ id });

    return result.deletedCount === 1;
  }
}
