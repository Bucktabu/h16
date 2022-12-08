import { IsString, Validate } from 'class-validator';
import { NotOwnedBlogValidation } from '../../../../validation/not-owned-blog.validation';

export class BindBlogDTO {
  @IsString()
  @Validate(NotOwnedBlogValidation)
  id: string;

  @IsString()
  userId: string;
}
