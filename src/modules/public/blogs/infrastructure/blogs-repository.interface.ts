import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../../super-admin/infrastructure/entity/blog-db.model';
import { BlogDto } from "../../../blogger/api/dto/blog.dto";

export interface IBlogsRepository {
  getBlogs(query: QueryParametersDto): Promise<BlogDBModel[]>;
  getTotalCount(searchNameTerm: string): Promise<number>;
  bloggerGetBlogs(
    userId: string,
    query: QueryParametersDto,
  ): Promise<BlogDBModel[]>
  bloggerGetTotalCount(userId: string, searchNameTerm: string): Promise<number>
  getBlogById(id: string): Promise<BlogDBModel | null>;
  createBlog(newBlog: BlogDBModel): Promise<BlogDBModel | null>
  updateBlog(id: string, inputModel: BlogDto): Promise<boolean>
  updateBanStatus(userId: string, isBanned: boolean): Promise<boolean>;
  deleteBlog(blogId: string): Promise<boolean>
}

export const IBlogsRepository = 'IBlogsRepository';
