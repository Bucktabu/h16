import { Inject, Injectable } from "@nestjs/common";
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class EmailExistValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async validate(email) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(email);

    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This email already exists';
  }
}
