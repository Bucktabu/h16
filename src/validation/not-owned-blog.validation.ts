import { ExecutionContext, Inject, PipeTransform } from "@nestjs/common";
import { SaBlogsRepository } from '../modules/super-admin/infrastructure/sa-blogs.repository';
import { ISaBlogsRepository } from "../modules/super-admin/infrastructure/sa-blogs-repository.interface";

export class NotOwnedBlogValidation implements PipeTransform {
  constructor(@Inject(ISaBlogsRepository) protected saBlogRepository: ISaBlogsRepository) {}

  async transform(context: ExecutionContext, metadata) {
    const req = context.switchToHttp().getRequest();

    const blog = await this.saBlogRepository.getBlogById(req.params.id);

    if (blog.userId !== null) {
      return false;
    }

    return true;
  }
}
