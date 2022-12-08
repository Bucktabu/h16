import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';
import { SaBlogsService } from '../application/sa-blogs-service';
import { AuthBasicGuard } from '../../../guards/auth.basic.guard';
import { BindBlogDTO } from './dto/bind-blog.dto';

@UseGuards(AuthBasicGuard)
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(protected saBlogsService: SaBlogsService) {}

  @Get()
  getBlogs(
    @Query()
    query: QueryParametersDTO,
  ) {
    return this.saBlogsService.getBlogs(query);
  }

  @Put(':id/bind-with-user/:userId')
  bindBlog(@Param() params: BindBlogDTO) {
    return this.saBlogsService.bindBlog(params);
  }
}
