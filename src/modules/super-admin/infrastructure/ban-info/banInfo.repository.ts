import { BanInfoModel } from '../entity/banInfo.model';
import { BanInfoScheme } from '../entity/banInfo.scheme';
import { Injectable } from '@nestjs/common';
import { IBanInfo } from './ban-info.interface';
import { BanUserDto } from '../../../blogger/api/dto/ban-user.dto';

@Injectable()
export class BanInfoRepository implements IBanInfo {
  async getBanInfo(parentId: string): Promise<BanInfoModel> {
    return BanInfoScheme.findOne({ parentId }, { _id: false, id: false, __v: false });
  }

  async getBannedUsers(blogId: string): Promise<BanInfoModel[]> {
    return BanInfoScheme.find({
      $and: [
        { blogId },
        { isBanned: true }
      ]}, { _id: false, __v: false }).lean();
  }

  async getTotalCount(id: string): Promise<number> {
    return BanInfoScheme.countDocuments({
      $and: [
        { $or: [ { parentId: id }, { blogId: id } ] },
        { isBanned: true }
      ] });
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
    parentId: string,
    isBanned: boolean,
    banDate: Date,
    banReason?: string,
  ): Promise<boolean> {
    try {
      await BanInfoScheme.updateOne(
        {parentId},
        { $set: { isBanned, banReason, banDate } },
        { upsert: true }
      )
      return true
    } catch (e) {
      return false
    }
  }

  async bloggerUpdateBanStatus(
    parentId: string,
    dto: BanUserDto,
    banDate: Date,
  ): Promise<boolean> {
    try {
      await BanInfoScheme.updateOne(
        {
          parentId,
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

  async deleteBanInfoById(parentId: string): Promise<boolean> {
    const result = await BanInfoScheme.deleteOne({ parentId });

    return result.deletedCount === 1;
  }
}
