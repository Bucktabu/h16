import { Injectable } from '@nestjs/common';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../../super-admin/infrastructure/entity/blog-db.model';
import { BlogSchema } from '../../../super-admin/infrastructure/entity/blog.schema';
import { giveSkipNumber } from '../../../../helper.functions';
import { LikesScheme } from '../../likes/infrastructure/entity/likes.scheme';
import { IBlogsRepository } from './blogs-repository.interface';

@Injectable()
export class BlogsRepository implements IBlogsRepository {
  async getBlogs(query: QueryParametersDto): Promise<BlogDBModel[]> {
    return BlogSchema.find({
      $and: [
        { name: { $regex: query.searchNameTerm, $options: 'i' } },
        { isBanned: false }
      ]
    },
    { _id: false, __v: false })
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      $and: [
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { isBanned: false }
      ]},
    );
  }

  async getBlogById(id: string): Promise<BlogDBModel | null> {
    return BlogSchema.findOne({$and: [{ id }, { isBanned: false }] }, { _id: false, __v: false });
  }

  async updateBanStatus(userId: string, isBanned: boolean): Promise<boolean> {
    try {
      await LikesScheme.updateOne({ userId }, { $set: { isBanned } });
      return true;
    } catch (e) {
      return false;
    }
  }
}
