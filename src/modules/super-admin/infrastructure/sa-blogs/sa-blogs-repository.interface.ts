import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../entity/blog-db.model';
import { BindBlogDto } from '../../api/dto/bind-blog.dto';
import { BanStatusModel } from "../../../../global-model/ban-status.model";

export interface ISaBlogsRepository {
  saGetBlogs(query: QueryParametersDto): Promise<BlogDBModel[]>;
  saGetTotalCount(banStatus: string, searchNameTerm: string): Promise<number>;
  getBlogById(id: string): Promise<BlogDBModel | null>;
  bindBlog(params: BindBlogDto): Promise<boolean>;
  updateBlogBanStatus(blogId: string, isBanned: boolean): Promise<boolean>;
}

export const ISaBlogsRepository = 'ISaBlogsRepository';
