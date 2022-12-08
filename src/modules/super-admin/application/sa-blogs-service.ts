import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { paginationContentPage } from '../../../helper.functions';
import { SaBlogsRepository } from '../infrastructure/sa-blogs.repository';
import { BindBlogDTO } from '../api/dto/bind-blog.dto';
import { Injectable } from "@nestjs/common";
import { BlogDBModel } from "../infrastructure/entity/blog-db.model";
import { UsersRepository } from "../infrastructure/users.repository";
import { BlogViewWithOwnerInfoModel } from "../api/dto/blog-view-with-owner-info.model";

@Injectable()
export class SaBlogsService {
  constructor(
    protected saBlogsRepository: SaBlogsRepository,
    protected userRepository: UsersRepository
  ) {}

  async getBlogs(query: QueryParametersDTO): Promise<ContentPageModel | null> {
    const blogsDB = await this.saBlogsRepository.getBlogs(query);

    if (!blogsDB) {
      return null;
    }

    const blogs = await Promise.all(
      blogsDB.map(async  (b) => await this.addOwnerInfo(b))
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

  private async addOwnerInfo(blog: BlogDBModel): Promise<BlogViewWithOwnerInfoModel> {
    const ownerInfo = await this.userRepository.getUserByIdOrLoginOrEmail(blog.userId)

    let userId = null
    let userLogin = null
    if (ownerInfo) {
      userId = ownerInfo.id
      userLogin = ownerInfo.login
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      blogOwnerInfo: {
        userId,
        userLogin
      }
    }
  }
}
