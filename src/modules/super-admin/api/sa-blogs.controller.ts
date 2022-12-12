import { Body, Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';
import { SaBlogsService } from '../application/sa-blogs-service';
import { AuthBasicGuard } from '../../../guards/auth.basic.guard';
import { BindBlogDTO } from './dto/bind-blog.dto';
import { BanBlogDto } from "./dto/ban-blog.dto";

@UseGuards(AuthBasicGuard)
@Controller('sa/blogs')
export class SaBlogsController {
  constructor(protected saBlogsService: SaBlogsService) {}

  @Get()
  getBlogs(
    @Query()
    query: QueryParametersDto,
  ) {
    return this.saBlogsService.getBlogs(query);
  }

  @Put(':id/bind-with-user/:userId')
  bindBlog(@Param() params: BindBlogDTO) {
    return this.saBlogsService.bindBlog(params);
  }

  @Put(':id/ban')
  updateBlogStatus(
    @Body() dto: BanBlogDto,// TODO можно ли не создавать отдельную дто для одного параметра
    @Param('id') blogId: string) {
    return this.saBlogsService.updateBlogBanStatus(blogId, dto.isBanned)
  }
}
