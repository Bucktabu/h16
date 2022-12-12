import { PostDBModel } from "./entity/post-db.model";
import { PostDTO } from "../api/dto/postDTO";

export interface IBloggerPostRepository {
  createPost(newPost: PostDBModel): Promise<PostDBModel | null>
  updatePost(postId: string, dto: PostDTO): Promise<boolean>
  deletePost(postId: string): Promise<boolean>
}

export const IBloggerPostRepository = 'IBloggerPostRepository' // TODO нам нужно экспортировать оба объекта?