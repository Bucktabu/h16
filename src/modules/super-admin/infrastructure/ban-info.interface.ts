import { BanInfoModel } from "./entity/banInfo.model";

export interface IBanInfo {
  getBanInfo(id: string): Promise<BanInfoModel>
  createBanInfo(banInfo: BanInfoModel): Promise<BanInfoModel | null>
  updateBanStatus(id: string, isBanned: boolean, banReason: string, banDate: Date): Promise<boolean>
  deleteBanInfoById(id: string): Promise<boolean>
}

export const IBanInfo = 'IBanInfo'