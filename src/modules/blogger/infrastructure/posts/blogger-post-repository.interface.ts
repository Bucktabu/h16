import { PostDBModel } from '../entity/post-db.model';
import { PostDto } from '../../api/dto/post.dto';

export interface IBloggerPostRepository {
  getPostById(postId: string): Promise<PostDBModel>
  createPost(newPost: PostDBModel): Promise<PostDBModel | null>;
  updatePost(postId: string, dto: PostDto): Promise<boolean>;
  deletePost(postId: string): Promise<boolean>;
}

export const IBloggerPostRepository = 'IBloggerPostRepository'; // TODO нам нужно экспортировать оба объекта?
