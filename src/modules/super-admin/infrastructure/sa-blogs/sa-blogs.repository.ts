import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { giveSkipNumber } from '../../../../helper.functions';
import { BindBlogDto } from '../../api/dto/bind-blog.dto';
import { BlogDBModel } from '../entity/blog-db.model';
import { BlogSchema } from '../entity/blog.schema';
import { Injectable } from '@nestjs/common';
import { ISaBlogsRepository } from './sa-blogs-repository.interface';

@Injectable()
export class SaBlogsRepository implements ISaBlogsRepository {
  async getBlogs(query: QueryParametersDto): Promise<BlogDBModel[]> {
    return BlogSchema.find({
        $and: [
          {name: { $regex: query.searchNameTerm, $options: 'i' }},
          {isBanned: false}]
      }, { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      $and: [{name: { $regex: searchNameTerm, $options: 'i' }}, {isBanned: false}],
    });
  }

  async getBlogById(id: string): Promise<BlogDBModel | null> {
    return BlogSchema.findOne({ id: id }, { _id: false, __v: false });
  }

  async bindBlog(params: BindBlogDto): Promise<boolean> {
    const result = await BlogSchema.updateOne(
      { id: params.id },
      { $set: { userId: params.userId } },
    );

    return result.matchedCount === 1;
  }

  async updateBlogBanStatus(id: string, isBanned: boolean): Promise<boolean> {
    const result = await BlogSchema.updateOne({id}, {$set: {isBanned}})

    return result.matchedCount === 1;
  }
}
