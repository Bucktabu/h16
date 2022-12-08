import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from '../../../decorator/user.decorator';
import { BloggerBlogService } from '../application/blogs.service';
import { BloggerPostsService } from '../application/posts.service';
import { AuthBearerGuard } from '../../../guards/auth.bearer.guard';
import { ForbiddenGuard } from '../../../guards/forbidden.guard';
import { BlogDTO } from './dto/blogDTO';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { PostDTO } from './dto/postDTO';
import { UserDBModel } from '../../super-admin/infrastructure/entity/userDB.model';
import { BlogViewModel } from '../../public/blogs/api/dto/blogView.model';

@UseGuards(AuthBearerGuard)
@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    protected blogsService: BloggerBlogService,
    protected postsService: BloggerPostsService,
  ) {}

  @Get()
  getBlogs(
    @Query() query: QueryParametersDTO,
    @User() user: UserDBModel,
  ) {
    return this.blogsService.getBlogs(user.id, query);
  }

  @Post()
  @HttpCode(201)
  createBlog(
    @Body() dto: BlogDTO,
    @User() user: UserDBModel,
  ): Promise<BlogViewModel> {
    const createdBlog = this.blogsService.createBlog(user.id, dto);

    if (!createdBlog) {
      throw new Error('Blog was not created');
    }

    return createdBlog;
  }

  @UseGuards(ForbiddenGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(
    @Body() dto: PostDTO,
    @Param('blogId') blogId: string,
  ) {
    const createdPost = await this.postsService.createPost(dto, blogId);

    if (!createdPost) {
      throw new Error('Post was not created');
    }

    return createdPost;
  }

  @UseGuards(ForbiddenGuard)
  @Put(':blogId')
  @HttpCode(204)
  async updateBlog(
    @Body() inputModel: BlogDTO,
    @Param('blogId') blogId: string,
  ) {
    const result = await this.blogsService.updateBlog(blogId, inputModel);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @UseGuards(ForbiddenGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePost(@Body() dto: PostDTO, @Param('postId') postId: string) {
    const result = await this.postsService.updatePost(postId, dto);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @UseGuards(ForbiddenGuard)
  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlog(@Param('blogId') blogId: string) {
    console.log(blogId)
    const result = await this.blogsService.deleteBlog(blogId);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @UseGuards(ForbiddenGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(@Param('postId') postId: string) {
    const result = await this.postsService.deletePost(postId);

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }
}
