import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { PostDBModel } from '../../../blogger/infrastructure/entity/post-db.model';

export interface IPostsRepository {
  getPosts(
    query: QueryParametersDto,
    blogId: string | undefined,
  ): Promise<PostDBModel[]>;
  getTotalCount(blogId: string | undefined): Promise<number>;
  getPostById(id: string): Promise<PostDBModel | null>;
  updatePostsBanStatus(blogId: string, isBanned: boolean): Promise<boolean>;
}

export const IPostsRepository = 'IPostsRepository';
