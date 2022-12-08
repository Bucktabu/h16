import { Injectable } from '@nestjs/common';
import { BanInfoRepository } from '../infrastructure/banInfo.repository';
import { EmailConfirmationRepository } from '../infrastructure/emailConfirmation.repository';
import { UsersRepository } from '../infrastructure/users.repository';
import { BanInfoModel } from '../infrastructure/entity/banInfo.model';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';
import { UserAccountModel } from '../infrastructure/entity/userAccount.model';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { UserDTO } from '../api/dto/userDTO';
import { UserViewModelWithBanInfo } from '../api/dto/userView.model';
import { toCreateUserViewModel } from '../../../data-mapper/to-create-user-view.model';
import { _generateHash, paginationContentPage } from "../../../helper.functions";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { BanUserDTO } from "../api/dto/ban-user.dto";
import { LikesRepository } from "../../public/likes/infrastructure/likes.repository";
import { BlogsRepository } from "../../public/blogs/infrastructure/blogs.repository";
import bcrypt from "bcrypt";
import { settings } from "../../../settings";

@Injectable()
export class UsersService {
  constructor(
    protected banInfoRepository: BanInfoRepository,
    protected blogRepository: BlogsRepository,
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected likesRepository: LikesRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return this.usersRepository.getUserByIdOrLoginOrEmail(IdOrLoginOrEmail);
  }

  async getUsers(query: QueryParametersDTO): Promise<ContentPageModel> {
    const usersDB = await this.usersRepository.getUsers(query);
    const users = await Promise.all(
      usersDB.map(async (u) => await this.addBanInfo(u)),
    );

    const totalCount = await this.usersRepository.getTotalCount(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      users,
      totalCount,
    );
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<boolean> {
    const hash = await _generateHash(newPassword);

    return await this.usersRepository.updateUserPassword(
      userId,
      hash.passwordSalt,
      hash.passwordHash,
    );
  }

  async updateBanStatus(userId: string, dto: BanUserDTO) {
    let banDate = null
    let banReason = null
    if (dto.isBanned) {
      banDate = new Date()
      banReason = dto.banReason
    }
    await this.blogRepository.updateBanStatus(userId, dto.isBanned)
    await this.likesRepository.updateBanStatus(userId, dto.isBanned)
    return this.banInfoRepository.updateBanStatus(userId, dto.isBanned, banReason, banDate)
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const userDeleted = await this.usersRepository.deleteUserById(userId);
    await this.banInfoRepository.deleteBanInfoById(userId);
    await this.emailConfirmationRepository.deleteEmailConfirmationById(userId);

    if (!userDeleted) {
      return false;
    }

    return true;
  }

  private async addBanInfo(
    userDB: UserDBModel,
  ): Promise<UserViewModelWithBanInfo> {
    const banInfo = await this.banInfoRepository.getBanInfo(userDB.id);

    return {
      id: userDB.id,
      login: userDB.login,
      email: userDB.email,
      createdAt: userDB.createdAt,
      banInfo,
    };
  }
}
