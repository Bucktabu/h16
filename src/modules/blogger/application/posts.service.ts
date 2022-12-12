import { toPostOutputBeforeCreate } from '../../../data-mapper/to-post-view-before-create.model';
import { PostDto } from '../api/dto/post.dto';
import { PostDBModel } from '../infrastructure/entity/post-db.model';
import { PostViewModel } from '../../public/posts/api/dto/postsView.model';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { IBloggerBlogRepository } from '../infrastructure/blogs/blogger-blog-repository.interface';
import { IBloggerPostRepository } from '../infrastructure/posts/blogger-post-repository.interface';

@Injectable()
export class BloggerPostService {
  constructor(
    @Inject(IBloggerPostRepository)
    protected postsRepository: IBloggerPostRepository,
    @Inject(IBloggerBlogRepository)
    protected blogsRepository: IBloggerBlogRepository,
  ) {}

  async createPost(
    dto: PostDto,
    blogId: string,
  ): Promise<PostViewModel | null> {
    const newPost = new PostDBModel(
      uuidv4(),
      dto.title,
      dto.shortDescription,
      dto.content,
      blogId,
      await this.getBlogName(blogId),
      new Date().toISOString(),
    );

    const createdPost = await this.postsRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }

    return toPostOutputBeforeCreate(createdPost);
  }

  async getBlogName(blogId: string): Promise<string> {
    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      return '';
    }

    return blog.name;
  }

  async updatePost(postId: string, dto: PostDto): Promise<boolean> {
    return await this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePost(postId);
  }
}
