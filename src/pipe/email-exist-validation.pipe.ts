import { Inject, PipeTransform } from '@nestjs/common';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';

export class EmailExistValidationPipe implements PipeTransform {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

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
