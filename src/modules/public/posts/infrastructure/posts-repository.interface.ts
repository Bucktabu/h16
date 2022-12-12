import { QueryParametersDTO } from "../../../../global-model/query-parameters.dto";
import { PostDBModel } from "../../../blogger/infrastructure/entity/post-db.model";

export interface IPostsRepository {
  getPosts(
    query: QueryParametersDTO,
    blogId: string | undefined,
  ): Promise<PostDBModel[]>
  getTotalCount(blogId: string | undefined): Promise<number>
  getPostById(postId: string): Promise<PostDBModel | null>
}

export const IPostsRepository = 'IPostsRepository'