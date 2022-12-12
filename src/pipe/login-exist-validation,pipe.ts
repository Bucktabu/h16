import { Inject, PipeTransform } from '@nestjs/common';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';

export class LoginExistValidationPipe implements PipeTransform {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async transform(dto, metadata) {
    const loginExist = await this.usersRepository.getUserByIdOrLoginOrEmail(
      dto.login,
    );

    if (loginExist) {
      return false;
    }

    return true;
  }
}
