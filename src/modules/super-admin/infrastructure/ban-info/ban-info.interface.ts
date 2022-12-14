import { BanInfoModel } from '../entity/banInfo.model';
import { BanUserDto } from '../../../blogger/api/dto/ban-user.dto';

export interface IBanInfo {
  getBanInfo(id: string): Promise<BanInfoModel>;
  getBannedUsers(blogId: string): Promise<BanInfoModel[]>;
  createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null>;
  saUpdateBanStatus(
    id: string,
    isBanned: boolean,
    banDate: Date,
    banReason?: string,
  ): Promise<boolean>;
  bloggerUpdateBanStatus(
    userId: string,
    dto: BanUserDto,
    banDate: Date,
  ): Promise<boolean>;
  deleteBanInfoById(id: string): Promise<boolean>;
  getTotalCount(blogId: string): Promise<number>;
}

export const IBanInfo = 'IBanInfo';
