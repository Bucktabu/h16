import { ExecutionContext, PipeTransform } from '@nestjs/common';
import { SaBlogsRepository } from '../modules/super-admin/infrastructure/sa-blogs.repository';

export class NotOwnedBlogValidation implements PipeTransform {
  constructor(protected saBlogRepository: SaBlogsRepository) {}

  async transform(context: ExecutionContext, metadata) {
    const req = context.switchToHttp().getRequest();

    const blog = await this.saBlogRepository.getBlogById(req.params.id);

    if (blog.userId !== null) {
      return false;
    }

    return true;
  }
}
