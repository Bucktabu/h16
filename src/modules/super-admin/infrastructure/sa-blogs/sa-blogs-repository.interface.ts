import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../entity/blog-db.model';
import { BindBlogDto } from '../../api/dto/bind-blog.dto';

export interface ISaBlogsRepository {
  getBlogs(query: QueryParametersDto): Promise<BlogDBModel[]>;
  getTotalCount(searchNameTerm: string): Promise<number>;
  getBlogById(id: string): Promise<BlogDBModel | null>;
  bindBlog(params: BindBlogDto): Promise<boolean>;
  updateBlogBanStatus(blogId: string, isBanned: boolean): Promise<boolean>;
}

export const ISaBlogsRepository = 'ISaBlogsRepository';
