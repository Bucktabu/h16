import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepository } from '../../../super-admin/infrastructure/emailConfirmation.repository';
import { EmailManager } from '../email-transfer/email.manager';

@Injectable()
export class AuthService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
    protected emailsManager: EmailManager,
  ) {}

  async sendPasswordRecovery(userId: string, email: string): Promise<boolean> {
    const newRecoveryCode = uuidv4();
    const result =
      await this.emailConfirmationRepository.updateConfirmationCode(
        userId,
        newRecoveryCode,
      );

    if (!result) {
      return false;
    }

    await this.emailsManager.sendPasswordRecoveryEmail(email, newRecoveryCode);
    return true;
  }

  async updateConfirmationCode(userId: string): Promise<string | null> {
    const newConfirmationCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 24 });
    const result =
      await this.emailConfirmationRepository.updateConfirmationCode(
        userId,
        newConfirmationCode,
        newExpirationDate,
      );

    if (!result) {
      return null;
    }

    return newConfirmationCode;
  }
}
