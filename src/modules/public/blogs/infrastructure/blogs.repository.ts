import { Injectable } from '@nestjs/common';
import { QueryParametersDTO } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../../super-admin/infrastructure/entity/blog-db.model';
import { BlogSchema } from '../../../super-admin/infrastructure/entity/blog.schema';
import { giveSkipNumber } from '../../../../helper.functions';
import { LikesScheme } from "../../likes/infrastructure/entity/likes.scheme";

@Injectable()
export class BlogsRepository {
  async getBlogs(query: QueryParametersDTO): Promise<BlogDBModel[]> {
    return BlogSchema.find(
      { name: { $regex: query.searchNameTerm, $options: 'i' } },
      { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });
  }

  async getBlogById(id: string): Promise<BlogDBModel | null> {
    return BlogSchema.findOne({ id,  }, { _id: false, __v: false });
  }

  async updateBanStatus(userId: string, isBanned: boolean) {
    try {
      await LikesScheme.updateOne(
        { userId },
        { $set: { isBanned } },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
