import {
  IsEmail,
  IsString,
  Length,
  MinLength,
  Validate, Validator
} from "class-validator";
import { Transform } from 'class-transformer';
import { EmailExistValidator } from '../../../../validation/email-exist-validator.service';
import { LoginExist } from "../../../../decorator/login-exist.decorator";

export class UserDTO {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @LoginExist()
  @Length(3, 10)
  login: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(6, 20)
  password: string;

  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @Validate(EmailExistValidator)
  @MinLength(3)
  email: string;
}
