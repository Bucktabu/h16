import { Injectable } from '@nestjs/common';
import { QueryParametersDTO } from '../../../../global-model/query-parameters.dto';
import { PostDBModel } from '../../../blogger/infrastructure/entity/post-db.model';
import { PostsScheme } from '../../../blogger/infrastructure/entity/posts.scheme';
import { giveSkipNumber } from '../../../../helper.functions';
import { IPostsRepository } from "./posts-repository.interface";

@Injectable()
export class PostsRepository implements IPostsRepository {
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
}
