import { TokenBlackListScheme } from './entity/tokenBlackList.scheme';

export class JwtRepository {
  async giveToken(refreshToken: string) {
    return TokenBlackListScheme.findOne({ refreshToken });
  }

  async addTokenInBlackList(refreshToken: string) {
    return TokenBlackListScheme.create({ refreshToken });
  }
}
