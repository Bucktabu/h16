import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { giveSkipNumber } from '../../../../helper.functions';
import { BindBlogDto } from '../../api/dto/bind-blog.dto';
import { BlogDBModel } from '../entity/blog-db.model';
import { BlogSchema } from '../entity/blog.schema';
import { Injectable } from '@nestjs/common';
import { ISaBlogsRepository } from './sa-blogs-repository.interface';
import { BanStatusModel } from "../../../../global-model/ban-status.model";

// @Injectable()
// export class SaBlogsRepository implements ISaBlogsRepository {
//   async saGetBlogs(query: QueryParametersDto): Promise<BlogDBModel[]> {
//     let filter = {}
//     if (query.banStatus === BanStatusModel.Banned) {
//       filter = { isBanned: true }
//     } else if (query.banStatus === BanStatusModel.NotBanned) {
//       filter = { isBanned: false }
//     }
//
//     return BlogSchema.find({
//         $and: [
//           {name: { $regex: query.searchNameTerm, $options: 'i' }},
//           filter]
//       }, { _id: false, __v: false },
//     )
//       .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
//       .skip(giveSkipNumber(query.pageNumber, query.pageSize))
//       .limit(query.pageSize)
//       .lean();
//   }
//
//   async saGetTotalCount(banStatus: string, searchNameTerm: string): Promise<number> {
//     let filter = {}
//     if (banStatus === BanStatusModel.Banned) {
//       filter = { isBanned: true }
//     } else if (banStatus === BanStatusModel.NotBanned) {
//       filter = { isBanned: false }
//     }
//
//     return BlogSchema.countDocuments({
//       $and: [{name: { $regex: searchNameTerm, $options: 'i' }}, filter],
//     });
//   }
//
//   async getBlogById(id: string): Promise<BlogDBModel | null> {
//     return BlogSchema.findOne({ id: id }, { _id: false, __v: false });
//   }
//
//   async bindBlog(params: BindBlogDto): Promise<boolean> {
//     const result = await BlogSchema.updateOne(
//       { id: params.id },
//       { $set: { userId: params.userId } },
//     );
//
//     return result.matchedCount === 1;
//   }
//
//   async updateBlogBanStatus(id: string, isBanned: boolean): Promise<boolean> {
//     const result = await BlogSchema.updateOne({id}, {$set: {isBanned}})
//
//     return result.matchedCount === 1;
//   }
// }
