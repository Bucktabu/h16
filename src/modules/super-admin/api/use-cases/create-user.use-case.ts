import { Injectable } from "@nestjs/common";
import { UserDTO } from "../dto/userDTO";
import { UserDBModel } from "../../infrastructure/entity/userDB.model";
import { EmailConfirmationModel } from "../../infrastructure/entity/emailConfirmation.model";
import add from "date-fns/add";
import { BanInfoModel } from "../../infrastructure/entity/banInfo.model";
import { UserAccountModel } from "../../infrastructure/entity/userAccount.model";
import { toCreateUserViewModel } from "../../../../data-mapper/to-create-user-view.model";
import { v4 as uuidv4 } from 'uuid';
import { _generateHash } from "../../../../helper.functions";
import { BanInfoRepository } from "../../infrastructure/banInfo.repository";
import { EmailConfirmationRepository } from "../../infrastructure/emailConfirmation.repository";
import { UsersRepository } from "../../infrastructure/users.repository";
import { settings } from "../../../../settings";

@Injectable()
export class CreateUserUseCase {
  constructor(
    protected banInfoRepository: BanInfoRepository,
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async execute(dto: UserDTO) {
    const hash = await _generateHash(dto.password);
    const userAccountId = uuidv4();
    //const createdAt = new Date().toISOString()

    //const accountData = UserDBModel.makeInstance(userAccountId, dto, hash, createdAt)

    const accountData = new UserDBModel(
      userAccountId,
      dto.login,
      dto.email,
      hash.passwordSalt,
      hash.passwordHash,
      new Date().toISOString(),
    );

    const emailConfirmation = new EmailConfirmationModel(
      userAccountId,
      uuidv4(),
      add(new Date(), { hours: Number(settings.CONFIRMATION_CODE_EXPIRE) }),
      false,
    );

    const banInfo = new BanInfoModel(userAccountId, false, null, null);

    const userAccount = new UserAccountModel(
      accountData,
      banInfo,
      emailConfirmation,
    );

    const createdAccount = await this.createUserAccount(userAccount);

    if (!createdAccount) {
      return null;
    }

    const createdUser = toCreateUserViewModel(accountData, banInfo);

    return {
      user: createdUser,
      email: accountData.email,
      code: emailConfirmation.confirmationCode,
    };
  }

  private async createUserAccount(
    userAccount: UserAccountModel,
  ): Promise<boolean> {
    const user = await this.usersRepository.createUser(userAccount.accountData);
    await this.banInfoRepository.createBanInfo(userAccount.banInfo);
    const emailConfirmation =
      await this.emailConfirmationRepository.createEmailConfirmation(
        userAccount.emailConfirmation,
      );

    if (!user || !emailConfirmation) {
      return false;
    }

    return true;
  }
}