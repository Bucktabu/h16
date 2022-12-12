import { Inject, Injectable } from "@nestjs/common";
import { BanInfoRepository } from '../infrastructure/banInfo.repository';
import { EmailConfirmationRepository } from '../infrastructure/email-confirmation.repository';
import { UsersRepository } from '../infrastructure/users.repository';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { UserDBModel } from '../infrastructure/entity/userDB.model';
import { UserViewModelWithBanInfo } from '../api/dto/userView.model';
import { _generateHash, paginationContentPage } from "../../../helper.functions";
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { BanUserDTO } from "../api/dto/ban-user.dto";
import { IBlogsRepository } from "../../public/blogs/infrastructure/blogs-repository.interface";
import { IBanInfo } from "../infrastructure/ban-info.interface";
import { IEmailConfirmation } from "../infrastructure/email-confirmation.interface";
import { ILikesRepository } from "../../public/likes/infrastructure/likes-repository.interface";
import { IUsersRepository } from "../infrastructure/users-repository.interface";

@Injectable()
export class UsersService {
  constructor(
    @Inject(IBanInfo) protected banInfoRepository: IBanInfo,
    @Inject(IBlogsRepository) protected blogsRepository: IBlogsRepository,
    @Inject(IEmailConfirmation) protected emailConfirmationRepository: IEmailConfirmation,
    @Inject(ILikesRepository) protected likesRepository: ILikesRepository,
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
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
    await this.blogsRepository.updateBanStatus(userId, dto.isBanned)
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