import { Injectable } from '@nestjs/common';
import { BloggerBlogRepository } from '../infrastructure/blogs.repository';
import { BlogDTO } from '../api/dto/blogDTO';
import { ContentPageModel } from '../../../global-model/contentPage.model';
import { toBlogViewModel } from '../../../data-mapper/to-blog-view.model';
import { paginationContentPage } from '../../../helper.functions';
import { v4 as uuidv4 } from 'uuid';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { BlogDBModel } from '../../super-admin/infrastructure/entity/blog-db.model';
import { BlogViewModel } from '../../public/blogs/api/dto/blogView.model';

@Injectable()
export class BloggerBlogService {
  constructor(protected blogsRepository: BloggerBlogRepository) {}

  async getBlogs(userId: string, query: QueryParametersDTO): Promise<ContentPageModel | null> {
    const blogs = await this.blogsRepository.getBlogs(userId, query);

    if (!blogs) {
      return null;
    }

    const totalCount = await this.blogsRepository.getTotalCount(
      userId, query.searchNameTerm,
    );

    return paginationContentPage(
      query.pageNumber,
      query.pageSize,
      blogs,
      totalCount,
    );
  }

  async createBlog(
    userId: string,
    inputModel: BlogDTO,
  ): Promise<BlogViewModel | null> {
    const newBlog = new BlogDBModel(
      uuidv4(),
      userId,
      inputModel.name,
      inputModel.description,
      inputModel.websiteUrl,
      new Date().toISOString(),
      false
    );

    const createdBlog = await this.blogsRepository.createBlog(newBlog);

    if (!createdBlog) {
      return null;
    }

    return toBlogViewModel(createdBlog);
  }

  async updateBlog(blogId: string, inputModel: BlogDTO): Promise<boolean> {
    return await this.blogsRepository.updateBlog(blogId, inputModel);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(blogId);
  }
}
