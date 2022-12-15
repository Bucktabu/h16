import { Inject, Injectable } from "@nestjs/common";
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class LoginExistValidator implements ValidatorConstraintInterface  {
  constructor(
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async validate(login) {
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(login);

    if (user) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'This login already exists';
  }
}
