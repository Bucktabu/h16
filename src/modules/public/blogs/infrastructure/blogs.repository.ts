import { Injectable } from '@nestjs/common';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../../super-admin/infrastructure/entity/blog-db.model';
import { BlogSchema } from '../../../super-admin/infrastructure/entity/blog.schema';
import { giveSkipNumber } from '../../../../helper.functions';
import { LikesScheme } from '../../likes/infrastructure/entity/likes.scheme';
import { IBlogsRepository } from './blogs-repository.interface';
import { BlogDto } from "../../../blogger/api/dto/blog.dto";
import { BanStatusModel } from "../../../../global-model/ban-status.model";
import { BindBlogDto } from "../../../super-admin/api/dto/bind-blog.dto";

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

  async bloggerGetBlogs(
    userId: string,
    query: QueryParametersDto,
  ): Promise<BlogDBModel[]> {
    return BlogSchema.find(
      {
        $and: [
          { userId },
          { name: { $regex: query.searchNameTerm, $options: 'i' } },
          { isBanned: false },
        ],
      },
      { _id: false, __v: false, userId: false, isBanned: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async bloggerGetTotalCount(userId: string, searchNameTerm: string): Promise<number> {
    return BlogSchema.countDocuments({
      $and: [
        { userId },
        { name: { $regex: searchNameTerm, $options: 'i' } },
        { isBanned: false }],
    });
  }

  async saGetBlogs(query: QueryParametersDto): Promise<BlogDBModel[]> {
    let filter = {}
    if (query.banStatus === BanStatusModel.Banned) {
      filter = { isBanned: true }
    } else if (query.banStatus === BanStatusModel.NotBanned) {
      filter = { isBanned: false }
    }

    return BlogSchema.find({
        $and: [
          {name: { $regex: query.searchNameTerm, $options: 'i' }},
          filter]
      }, { _id: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async saGetTotalCount(banStatus: string, searchNameTerm: string): Promise<number> {
    let filter = {}
    if (banStatus === BanStatusModel.Banned) {
      filter = { isBanned: true }
    } else if (banStatus === BanStatusModel.NotBanned) {
      filter = { isBanned: false }
    }

    return BlogSchema.countDocuments({
      $and: [{name: { $regex: searchNameTerm, $options: 'i' }}, filter],
    });
  }

  async getBlogById(id: string): Promise<BlogDBModel | null> {
    return BlogSchema.findOne({$and: [{ id }, { isBanned: false }] }, { _id: false, __v: false });
  }

  async createBlog(newBlog: BlogDBModel): Promise<BlogDBModel | null> {
    try {
      await BlogSchema.create(newBlog);
      return newBlog;
    } catch (e) {
      return null;
    }
  }

  async bindBlog(params: BindBlogDto): Promise<boolean> {
    const result = await BlogSchema.updateOne(
      { id: params.id },
      { $set: { userId: params.userId } },
    );

    return result.matchedCount === 1;
  }

  async updateBlog(id: string, inputModel: BlogDto): Promise<boolean> {
    const result = await BlogSchema.updateOne(
      { id },
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

  async updateBanStatus(userId: string, isBanned: boolean): Promise<boolean> {
    try {
      await LikesScheme.updateOne({ userId }, { $set: { isBanned } });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateBlogBanStatus(id: string, isBanned: boolean): Promise<boolean> {
    const result = await BlogSchema.updateOne({id}, {$set: {isBanned}})

    return result.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const result = await BlogSchema.deleteOne({ id: blogId });

    return result.deletedCount === 1;
  }
}
