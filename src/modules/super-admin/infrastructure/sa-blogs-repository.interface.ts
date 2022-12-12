import { QueryParametersDTO } from "../../../global-model/query-parameters.dto";
import { BlogDBModel } from "./entity/blog-db.model";
import { BindBlogDTO } from "../api/dto/bind-blog.dto";

export interface ISaBlogsRepository {
  getBlogs(query: QueryParametersDTO): Promise<BlogDBModel[]>
  getTotalCount(searchNameTerm: string): Promise<number>
  getBlogById(id: string): Promise<BlogDBModel | null>
  bindBlog(params: BindBlogDTO): Promise<boolean>
}

export const ISaBlogsRepository = 'ISaBlogsRepository'