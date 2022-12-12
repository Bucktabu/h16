import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { paginationContentPage } from '../../../helper.functions';
import { BindBlogDTO } from '../api/dto/bind-blog.dto';
import { Inject, Injectable } from '@nestjs/common';
import { BlogDBModel } from '../infrastructure/entity/blog-db.model';
import { BlogViewWithOwnerInfoModel } from '../api/dto/blog-view-with-owner-info.model';
import { ISaBlogsRepository } from '../infrastructure/sa-blogs/sa-blogs-repository.interface';
import { IUsersRepository } from '../infrastructure/users/users-repository.interface';

@Injectable()
export class SaBlogsService {
  constructor(
    @Inject(ISaBlogsRepository) protected saBlogsRepository: ISaBlogsRepository,
    @Inject(IUsersRepository) protected userRepository: IUsersRepository,
  ) {}

  async getBlogs(query: QueryParametersDto): Promise<ContentPageModel | null> {
    const blogsDB = await this.saBlogsRepository.getBlogs(query);

    if (!blogsDB) {
      return null;
    }

    const blogs = await Promise.all(
      blogsDB.map(async (b) => await this.addOwnerInfo(b)),
    );

    const totalCount = await this.saBlogsRepository.getTotalCount(
      query.searchNameTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      blogs,
      totalCount,
    );
  }

  async bindBlog(params: BindBlogDTO) {
    return this.saBlogsRepository.bindBlog(params);
  }

  async updateBlogBanStatus(blogId: string, isBanned: boolean): Promise<boolean> {
    return this.saBlogsRepository.updateBlogBanStatus(blogId, isBanned)
  }

  private async addOwnerInfo(
    blog: BlogDBModel,
  ): Promise<BlogViewWithOwnerInfoModel> {
    const ownerInfo = await this.userRepository.getUserByIdOrLoginOrEmail(
      blog.userId,
    );

    let userId = null;
    let userLogin = null;
    if (ownerInfo) {
      userId = ownerInfo.id;
      userLogin = ownerInfo.login;
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      blogOwnerInfo: {
        userId,
        userLogin,
      },
    };
  }
}
