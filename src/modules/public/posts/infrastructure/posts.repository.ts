import { Injectable } from '@nestjs/common';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { PostDBModel } from '../../../blogger/infrastructure/entity/post-db.model';
import { PostsScheme } from '../../../blogger/infrastructure/entity/posts.scheme';
import { giveSkipNumber } from '../../../../helper.functions';
import { IPostsRepository } from './posts-repository.interface';

@Injectable()
export class PostsRepository implements IPostsRepository {
  async getPosts(
    query: QueryParametersDto,
    blogId: string | undefined,
  ): Promise<PostDBModel[]> {
    return PostsScheme.find({
      $and: [
        { blogId: { $regex: blogId } },
        { isBanned: false }
      ]},
      { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(blogId: string | undefined): Promise<number> {
    return PostsScheme.countDocuments({
      $and: [
        { blogId: { $regex: blogId } },
        { isBanned: false }
      ]});
  }

  async getPostById(postId: string): Promise<PostDBModel | null> {
    return PostsScheme.findOne({
      $and: [
        { id: postId },
        { isBanned: false }
      ]
    },
    { _id: false, __v: false });
  }

  async updatePostsBanStatus(blogId: string, isBanned: boolean): Promise<boolean> {
    try {
      await PostsScheme.updateMany({ blogId }, {$set: {isBanned}})
      return true
    } catch (e) {
      return false
    }
  }
}
