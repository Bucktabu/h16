import { PostDBModel } from '../entity/post-db.model';
import { PostsScheme } from '../entity/posts.scheme';
import { PostDto } from '../../api/dto/post.dto';
import { Injectable } from '@nestjs/common';
import { IBloggerPostRepository } from './blogger-post-repository.interface';

@Injectable()
export class BloggerPostRepository implements IBloggerPostRepository {
  async getPostById(postId: string): Promise<PostDBModel> {
    return PostsScheme.findOne({postId})
  }

  async createPost(newPost: PostDBModel): Promise<PostDBModel | null> {
    try {
      await PostsScheme.create(newPost);
      return newPost;
    } catch (e) {
      return null;
    }
  }

  async updatePost(postId: string, dto: PostDto): Promise<boolean> {
    const result = await PostsScheme.updateOne(
      { id: postId },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deletePost(postId: string): Promise<boolean> {
    const result = await PostsScheme.deleteOne({ id: postId });

    return result.deletedCount === 1;
  }
}
