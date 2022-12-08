import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { giveSkipNumber } from '../../../helper.functions';
import { BindBlogDTO } from '../api/dto/bind-blog.dto';
import { BlogDBModel } from './entity/blog-db.model';
import { BlogSchema } from './entity/blog.schema';
import { Injectable } from "@nestjs/common";

@Injectable()
export class SaBlogsRepository {
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
    return BlogSchema.findOne({ id: id }, { _id: false, __v: false });
  }

  async bindBlog(params: BindBlogDTO) {
    const result = await BlogSchema.updateOne(
      { id: params.id },
      { $set: { userId: params.userId } },
    );

    return result.matchedCount === 1;
  }
}
