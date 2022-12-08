import {
  IsEmail,
  IsString,
  Length,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { EmailExistValidationPipe } from '../../../../pipe/email-exist-validation.pipe';
import { LoginExistValidationPipe } from '../../../../pipe/login-exist-validation,pipe';

export class UserDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(LoginExistValidationPipe)
  @Length(3, 10)
  login: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;

  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Validate(EmailExistValidationPipe)
  @MinLength(3)
  email: string;
}
