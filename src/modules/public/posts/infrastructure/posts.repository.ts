import { Injectable } from '@nestjs/common';
import { PostWithBlogIdDTO } from '../api/dto/postDTO';
import { QueryParametersDTO } from '../../../../global-model/query-parameters.dto';
import { PostDBModel } from '../../../blogger/infrastructure/entity/post-db.model';
import { PostsScheme } from '../../../blogger/infrastructure/entity/posts.scheme';
import { giveSkipNumber } from '../../../../helper.functions';

@Injectable()
export class PostsRepository {
  async getPosts(
    query: QueryParametersDTO,
    blogId: string | undefined,
  ): Promise<PostDBModel[]> {
    return PostsScheme.find(
      { blogId: { $regex: blogId } },
      { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(blogId: string | undefined): Promise<number> {
    return PostsScheme.countDocuments({ blogId: { $regex: blogId } });
  }

  async getPostById(postId: string): Promise<PostDBModel | null> {
    return PostsScheme.findOne({ id: postId }, { _id: false, __v: false });
  }

  async createPost(newPost: PostDBModel): Promise<PostDBModel | null> {
    try {
      await PostsScheme.create(newPost);
      return newPost;
    } catch (e) {
      return null;
    }
  }

  async updatePost(postId: string, dto: PostWithBlogIdDTO): Promise<boolean> {
    const result = await PostsScheme.updateOne(
      { id: postId },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    const result = await PostsScheme.deleteOne({ id: postId });

    return result.deletedCount === 1;
  }
}
