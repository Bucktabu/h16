import { PostDBModel } from '../../../public/posts/infrastructure/entity/post-db.model';
import { PostsScheme } from '../../../public/posts/infrastructure/entity/posts.scheme';
import { PostDto } from '../../api/dto/post.dto';
import { Injectable } from '@nestjs/common';
import { IBloggerPostRepository } from './blogger-post-repository.interface';

//@Injectable()
//  export class BloggerPostRepository implements IBloggerPostRepository {
//   async getPostById(id: string): Promise<PostDBModel> {
//     return PostsScheme.findOne({
//         $and: [
//           { id },
//           { isBanned: false }
//         ]
//       },
//       { _id: false, __v: false })
//   }
//
//   async createPost(newPost: PostDBModel): Promise<PostDBModel | null> {
//     try {
//       await PostsScheme.create(newPost);
//       return newPost;
//     } catch (e) {
//       return null;
//     }
//   }
//
//   async updatePost(postId: string, dto: PostDto): Promise<boolean> {
//     const result = await PostsScheme.updateOne(
//       { id: postId },
//       {
//         $set: {
//           title: dto.title,
//           shortDescription: dto.shortDescription,
//           content: dto.content,
//         },
//       },
//     );
//
//     return result.matchedCount === 1;
//   }
//
//   async deletePost(postId: string): Promise<boolean> {
//     const result = await PostsScheme.deleteOne({ id: postId });
//
//     return result.deletedCount === 1;
//   }
// }
