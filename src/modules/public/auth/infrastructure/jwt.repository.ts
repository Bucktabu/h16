import { TokenBlackListScheme } from './entity/tokenBlackList.scheme';
import { IJwtRepository } from "./jwt-repository.interface";

export class JwtRepository implements IJwtRepository {
  async giveToken(refreshToken: string): Promise<string> {
    return TokenBlackListScheme.findOne({ refreshToken });
  }

  async addTokenInBlackList(refreshToken: string): Promise<boolean> {
    try {
      await TokenBlackListScheme.create({ refreshToken })
      return true
    } catch (e) {
      return false
    }
  }
}
