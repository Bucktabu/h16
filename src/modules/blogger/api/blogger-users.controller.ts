import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthBearerGuard } from '../../../guards/auth.bearer.guard';
import { BloggerBlogService } from '../application/blogs.service';
import { BanUserDto } from './dto/ban-user.dto';
import { QueryParametersDto } from '../../../global-model/query-parameters.dto';

@UseGuards(AuthBearerGuard)
@Controller('blogger/users')
export class BloggerUsersController {
  constructor(protected blogsService: BloggerBlogService) {}

  @Get('blog/:id')
  async getBannedUsers(
    @Query() query: QueryParametersDto,
    @Param('id') blogId: string,
  ) {
    return await this.blogsService.getBannedUsers(blogId, query);
  }

  @Put(':id/ban')
  @HttpCode(204)
  async updateUserBanStatus(
    @Body() dto: BanUserDto,
    @Param('id') userId: string,
  ) {
    return await this.blogsService.updateUserBanStatus(userId, dto);
  }
}
