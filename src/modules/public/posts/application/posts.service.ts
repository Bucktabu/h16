import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '../../auth/application/jwt.service';
import { LikesService } from '../../likes/application/likes.service';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostViewModel } from '../api/dto/postsView.model';
import { UsersRepository } from '../../../super-admin/infrastructure/users.repository';
import { QueryParametersDTO } from '../../../../global-model/query-parameters.dto';
import { ContentPageModel } from '../../../../global-model/contentPage.model';
import { paginationContentPage } from '../../../../helper.functions';
import { PostDBModel } from '../../../blogger/infrastructure/entity/post-db.model';
import { IPostsRepository } from "../infrastructure/posts-repository.interface";
import { IUsersRepository } from "../../../super-admin/infrastructure/users-repository.interface";

@Injectable()
export class PostsService {
  constructor(
    protected jwtService: JwtService,
    protected likesService: LikesService,
    @Inject(IPostsRepository) protected postsRepository: IPostsRepository,
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async getPosts(
    query: QueryParametersDTO,
    blogId: string,
    token?: string,
  ): Promise<ContentPageModel | null> {
    const postsDB = await this.postsRepository.getPosts(query, blogId);

    if (!postsDB) {
      return null;
    }

    const totalCount = await this.postsRepository.getTotalCount(blogId);
    const userId = await this.jwtService.getUserIdViaToken(token);
    const posts = await Promise.all(
      postsDB.map(async (p) => await this.addLikesInfoForPost(p, userId)),
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      posts,
      totalCount,
    );
  }

  async getPostById(
    postId: string,
    token?: string,
  ): Promise<PostViewModel | null> {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      return null;
    }
    console.log(token);
    const userId = await this.jwtService.getUserIdViaToken(token);
    console.log(userId);
    return await this.addLikesInfoForPost(post, userId);
  }

  async updateLikesInfo(
    userId: string,
    commentId: string,
    likeStatus: string,
  ): Promise<boolean> {
    const addedAt = new Date().toISOString();
    const login = await this.usersRepository.getUserByIdOrLoginOrEmail(userId);

    if (!login) {
      return false;
    }

    return await this.likesService.updateUserReaction(
      commentId,
      userId,
      likeStatus,
      addedAt,
      login.login,
    );
  }

  private async addLikesInfoForPost(
    post: PostDBModel,
    userId: string | null,
  ): Promise<PostViewModel> {
    const result = await this.likesService.getReactionAndReactionCount(
      post.id,
      userId!,
    );
    const newestLikes = await this.likesService.getNewestLikes(post.id);

    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        myStatus: result.reaction,
        likesCount: result.likesCount,
        dislikesCount: result.dislikesCount,
        newestLikes: newestLikes!,
      },
    };
  }
}
