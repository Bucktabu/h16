import mongoose, { Model } from "mongoose";
import { EmailConfirmationModel } from './emailConfirmation.model';

const emailConfirmationScheme = new mongoose.Schema<EmailConfirmationModel, EmailConfirmationModelType, EmailConfirmMethodType>({
  id: { type: String, required: true },
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true, default: false },
});

emailConfirmationScheme.method('canBeConfirmed', function canBeConfirmed() {
  const that = this as EmailConfirmationModel
  if (that.isConfirmed === true) {
    return false;
  }

  if (that.expirationDate < new Date()) {
    return false;
  }

  return true;
})

export const EmailConfirmationScheme = mongoose.model<EmailConfirmationModel, EmailConfirmationModelType>(
  'emailConfirmation',
  emailConfirmationScheme,
);

export type EmailConfirmMethodType = {
  canBeConfirmed: () => boolean
}

type EmailConfirmationModelType = Model<EmailConfirmationModel, {}, EmailConfirmMethodType>
