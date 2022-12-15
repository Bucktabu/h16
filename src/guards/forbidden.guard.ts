import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBloggerBlogRepository } from '../modules/blogger/infrastructure/blogs/blogger-blog-repository.interface';

@Injectable()
export class ForbiddenGuard implements CanActivate {
  constructor(
    @Inject(IBloggerBlogRepository)
    protected blogsRepository: IBloggerBlogRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    let blogId = req.params.id

    if (req.body.blogId) {
      blogId = req.body.blogId
    }

    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.userId !== req.user.id) {
      throw new ForbiddenException();
    }

    return true;
  }
}
