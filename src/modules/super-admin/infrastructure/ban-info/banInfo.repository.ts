import { BanInfoModel } from '../entity/banInfo.model';
import { BanInfoScheme } from '../entity/banInfo.scheme';
import { Injectable } from '@nestjs/common';
import { IBanInfo } from './ban-info.interface';
import { BanUserDto } from '../../../blogger/api/dto/ban-user.dto';

@Injectable()
export class BanInfoRepository implements IBanInfo {
  async getBanInfo(id: string): Promise<BanInfoModel> {
    return BanInfoScheme.findOne({ id }, { _id: false, id: false, __v: false });
  }

  async getBannedUsers(blogId: string): Promise<BanInfoModel[]> {
    return BanInfoScheme.find({ blogId }, { _id: false, __v: false }).lean();
  }

  async getTotalCount(blogId: string): Promise<number> {
    return BanInfoScheme.countDocuments({ blogId });
  }

  async createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null> {
    try {
      await BanInfoScheme.create(banInfo);
      return banInfo;
    } catch (e) {
      return null;
    }
  }

  async saUpdateBanStatus(
    id: string,
    isBanned: boolean,
    banReason: string,
    banDate: Date,
  ): Promise<boolean> {
    const result = await BanInfoScheme.updateOne(
      { id },
      { $set: { isBanned, banReason, banDate } },
    );

    return result.matchedCount === 1;
  }

  async bloggerUpdateBanStatus(
    id: string,
    dto: BanUserDto,
    banDate: Date,
  ): Promise<boolean> {
    try {
      await BanInfoScheme.updateOne(
        {
          id,
          blogId: dto.blogId,
        },
        {
          $set: { isBanned: dto.isBanned, banReason: dto.banReason, banDate },
        },
        { upsert: true },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteBanInfoById(id: string): Promise<boolean> {
    const result = await BanInfoScheme.deleteOne({ id });

    return result.deletedCount === 1;
  }
}
