import { BlogDTO } from "../api/dto/blogDTO";
import { QueryParametersDTO } from "../../../global-model/query-parameters.dto";
import { BlogDBModel } from "../../super-admin/infrastructure/entity/blog-db.model";

export interface IBloggerBlogRepository {
  getBlogs(userId: string, query: QueryParametersDTO): Promise<BlogDBModel[]>
  getTotalCount(userId: string, searchNameTerm: string): Promise<number>
  getBlogById(id: string): Promise<BlogDBModel | null>
  createBlog(newBlog: BlogDBModel): Promise<BlogDBModel | null>
  updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean>
  deleteBlog(blogId: string): Promise<boolean>
}

export const IBloggerBlogRepository = 'IBloggerBlogRepository'
