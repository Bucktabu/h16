import { PipeTransform } from '@nestjs/common';
import { UsersRepository } from '../modules/super-admin/infrastructure/users.repository';

export class LoginExistValidationPipe implements PipeTransform {
  constructor(protected usersRepository: UsersRepository) {}

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
