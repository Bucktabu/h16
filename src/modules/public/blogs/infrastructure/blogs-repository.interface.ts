import { QueryParametersDTO } from "../../../../global-model/query-parameters.dto";
import { BlogDBModel } from "../../../super-admin/infrastructure/entity/blog-db.model";

export interface IBlogsRepository {
  getBlogs(query: QueryParametersDTO): Promise<BlogDBModel[]>
  getTotalCount(searchNameTerm: string): Promise<number>
  getBlogById(id: string): Promise<BlogDBModel | null>
  updateBanStatus(userId: string, isBanned: boolean): Promise<boolean>
}

export const IBlogsRepository = 'IBlogsRepository'