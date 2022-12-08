import { Injectable } from '@nestjs/common';
import { EmailConfirmationRepository } from '../infrastructure/emailConfirmation.repository';
import { EmailConfirmationModel } from '../infrastructure/entity/emailConfirmation.model';

@Injectable()
export class EmailConfirmationService {
  constructor(
    protected emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async getConfirmationByCode(code: string): Promise<EmailConfirmationModel> {
    return this.emailConfirmationRepository.getEmailConfirmationByCodeOrId(
      code,
    );
  }

  async checkConfirmation(id: string): Promise<boolean> {
    const result = await this.emailConfirmationRepository.checkConfirmation(id);

    if (result.isConfirmed === true) {
      return true;
    }

    return false;
  }

  async updateConfirmationInfo(idOrCode: string) {
    return this.emailConfirmationRepository.updateConfirmationInfo(idOrCode);
  }
}
