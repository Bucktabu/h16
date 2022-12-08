import { toPostOutputBeforeCreate } from '../../../data-mapper/to-post-view-before-create.model';
import { PostDTO } from '../api/dto/postDTO';
import { PostDBModel } from '../infrastructure/entity/post-db.model';
import { PostViewModel } from '../../public/posts/api/dto/postsView.model';
import { BloggerBlogRepository } from '../infrastructure/blogs.repository';
import { BloggerPostsRepository } from '../infrastructure/posts.repository';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";

@Injectable()
export class BloggerPostsService {
  constructor(
    protected postsRepository: BloggerPostsRepository,
    protected blogsRepository: BloggerBlogRepository,
  ) {}

  async createPost(
    dto: PostDTO,
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

  async updatePost(postId: string, dto: PostDTO): Promise<boolean> {
    return await this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePost(postId);
  }
}
