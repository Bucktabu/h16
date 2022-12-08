import { PipeTransform } from '@nestjs/common';
import { UsersRepository } from '../modules/super-admin/infrastructure/users.repository';

export class EmailExistValidationPipe implements PipeTransform {
  constructor(protected usersRepository: UsersRepository) {}

  async transform(dto, metadata) {
    const emailExist = await this.usersRepository.getUserByIdOrLoginOrEmail(
      dto.email,
    );

    if (emailExist) {
      return false;
    }

    return true;
  }
}
