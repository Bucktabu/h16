import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EmailConfirmationRepository } from '../modules/super-admin/infrastructure/email-confirmation/email-confirmation.repository';
import { IEmailConfirmation } from '../modules/super-admin/infrastructure/email-confirmation/email-confirmation.interface';

@ValidatorConstraint({ name: 'ConfirmationCodeValid', async: true })
@Injectable()
export class ConfirmationCodeValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(IEmailConfirmation)
    protected emailConfirmationRepository: IEmailConfirmation,
  ) {}

  async validate(code: string) {
    const emailConfirmation =
      await this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
        code,
      );

    if (!emailConfirmation) {
      return false;
    }

    return emailConfirmation.canBeConfirmed(); // TODO 'smart' object
  }

  defaultMessage(args: ValidationArguments) {
    return 'Confirmation code is not valid';
  }
}
