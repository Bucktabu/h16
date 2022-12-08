import { Injectable } from '@nestjs/common';
import { BlogDTO } from '../api/dto/blogDTO';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { giveSkipNumber } from '../../../helper.functions';
import { BlogDBModel } from 'src/modules/super-admin/infrastructure/entity/blog-db.model';
import { BlogSchema } from '../../super-admin/infrastructure/entity/blog.schema';

@Injectable()
export class BloggerBlogRepository {
  async getBlogs(userId: string, query: QueryParametersDTO): Promise<BlogDBModel[]> {
    return BlogSchema.find({
        $and: [
          { userId, isBanned: false },
          { name: { $regex: query.searchNameTerm, $options: 'i' } }
        ]}, { _id: false, __v: false, userId: false, isBanned: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(userId: string, searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      $and: [
        { userId },
        { name: {$regex: searchNameTerm, $options: 'i' }}
      ],
    });
  }

  async getBlogById(id: string): Promise<BlogDBModel | null> {
    return BlogSchema.findOne({ id: id }, { _id: false, __v: false });
  }

  async createBlog(newBlog: BlogDBModel): Promise<BlogDBModel | null> {
    try {
      await BlogSchema.create(newBlog);
      return newBlog;
    } catch (e) {
      return null;
    }
  }

  async updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean> {
    const result = await BlogSchema.updateOne(
      { id: blogId },
      {
        $set: {
          name: inputModel.name,
          description: inputModel.description,
          websiteUrl: inputModel.websiteUrl,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const result = await BlogSchema.deleteOne({ id: blogId });

    return result.deletedCount === 1;
  }
}
