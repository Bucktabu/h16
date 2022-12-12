import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BloggerBlogsController } from './modules/blogger/api/blogger-blogs.controller';
import { BloggerPostService } from './modules/blogger/application/posts.service';
import { BloggerBlogService } from './modules/blogger/application/blogs.service';
import { BloggerPostRepository } from './modules/blogger/infrastructure/posts/posts.repository';
import { BloggerBlogRepository } from './modules/blogger/infrastructure/blogs/blogs.repository';
import { BanInfoRepository } from './modules/super-admin/infrastructure/ban-info/banInfo.repository';
import { EmailConfirmationRepository } from './modules/super-admin/infrastructure/email-confirmation/email-confirmation.repository';
import { SaBlogsController } from './modules/super-admin/api/sa-blogs.controller';
import { SaBlogsService } from './modules/super-admin/application/sa-blogs-service';
import { SaBlogsRepository } from './modules/super-admin/infrastructure/sa-blogs/sa-blogs.repository';
import { UsersController } from './modules/super-admin/api/users.controller';
import { UsersService } from './modules/super-admin/application/users.service';
import { UsersRepository } from './modules/super-admin/infrastructure/users/users.repository';
import { JwtRepository } from './modules/public/auth/infrastructure/jwt.repository';
import { JwtService } from './modules/public/auth/application/jwt.service';
import { AuthController } from './modules/public/auth/api/auth.controller';
import { BlogsController } from './modules/public/blogs/api/blogs.controller';
import { CommentsController } from './modules/public/comments/api/comments.controller';
import { PostsController } from './modules/public/posts/api/posts.controller';
import { SecurityController } from './modules/public/security/api/security.controller';
import { TestingController } from './modules/testing/testingController';
import { AuthService } from './modules/public/auth/application/auth.service';
import { EmailConfirmationService } from './modules/super-admin/application/emailConfirmation.service';
import { CommentsService } from './modules/public/comments/application/comments.service';
import { EmailAdapters } from './modules/public/auth/email-transfer/email.adapter';
import { EmailManager } from './modules/public/auth/email-transfer/email.manager';
import { LikesService } from './modules/public/likes/application/likes.service';
import { PostsService } from './modules/public/posts/application/posts.service';
import { SecurityService } from './modules/public/security/application/security.service';
import { BlogsService } from './modules/public/blogs/application/blogs.service';
import { BlogsRepository } from './modules/public/blogs/infrastructure/blogs.repository';
import { CommentsRepository } from './modules/public/comments/infrastructure/comments.repository';
import { LikesRepository } from './modules/public/likes/infrastructure/likes.repository';
import { PostsRepository } from './modules/public/posts/infrastructure/posts.repository';
import { SecurityRepository } from './modules/public/security/infrastructure/security.repository';
import { EmailExistValidationPipe } from './pipe/email-exist-validation.pipe';
import { EmailResendingValidationPipe } from './pipe/email-resending.pipe';
import { LoginExistValidationPipe } from './pipe/login-exist-validation,pipe';
import { BlogExistValidator } from './validation/blog-exist.validator';
import { ConfirmationCodeValidator } from './validation/confirmation-code.validator';
import { CreateUserUseCase } from './modules/super-admin/use-cases/create-user.use-case';
import {
  /*Blog,*/ BlogSchema,
} from './modules/super-admin/infrastructure/entity/blog.schema';
import { IBloggerBlogRepository } from './modules/blogger/infrastructure/blogs/blogger-blog-repository.interface';
import { IBloggerPostRepository } from './modules/blogger/infrastructure/posts/blogger-post-repository.interface';
import { IJwtRepository } from './modules/public/auth/infrastructure/jwt-repository.interface';
import { IBlogsRepository } from './modules/public/blogs/infrastructure/blogs-repository.interface';
import { ICommentsRepository } from './modules/public/comments/infrastructure/comments-repository.interface';
import { ILikesRepository } from './modules/public/likes/infrastructure/likes-repository.interface';
import { IPostsRepository } from './modules/public/posts/infrastructure/posts-repository.interface';
import { ISecurityRepository } from './modules/public/security/infrastructure/security-repository.interface';
import { IBanInfo } from './modules/super-admin/infrastructure/ban-info/ban-info.interface';
import { IEmailConfirmation } from './modules/super-admin/infrastructure/email-confirmation/email-confirmation.interface';
import { ISaBlogsRepository } from './modules/super-admin/infrastructure/sa-blogs/sa-blogs-repository.interface';
import { IUsersRepository } from './modules/super-admin/infrastructure/users/users-repository.interface';

const controllers = [
  BloggerBlogsController,
  SaBlogsController,
  AuthController,
  BlogsController,
  CommentsController,
  PostsController,
  SecurityController,
  TestingController,
  UsersController,
];

const pipes = [
  EmailExistValidationPipe,
  EmailResendingValidationPipe,
  LoginExistValidationPipe,
];

const repositories = [
  { provide: IBloggerBlogRepository, useClass: BloggerBlogRepository },
  { provide: IBloggerPostRepository, useClass: BloggerPostRepository },
  { provide: IBanInfo, useClass: BanInfoRepository },
  { provide: IBlogsRepository, useClass: BlogsRepository },
  { provide: ICommentsRepository, useClass: CommentsRepository },
  { provide: IEmailConfirmation, useClass: EmailConfirmationRepository },
  { provide: IJwtRepository, useClass: JwtRepository },
  { provide: ILikesRepository, useClass: LikesRepository },
  { provide: IPostsRepository, useClass: PostsRepository },
  { provide: ISecurityRepository, useClass: SecurityRepository },
  { provide: ISaBlogsRepository, useClass: SaBlogsRepository },
  { provide: IUsersRepository, useClass: UsersRepository },
];

const services = [
  BloggerBlogService,
  BloggerPostService,
  AuthService,
  BlogsService,
  CommentsService,
  EmailAdapters,
  EmailManager,
  EmailConfirmationService,
  JwtService,
  LikesService,
  PostsService,
  SecurityService,
  SaBlogsService,
  UsersService,
];

const schemes = [
  // { name: Blog.name, schema: BlogSchema },
];

const validators = [BlogExistValidator, ConfirmationCodeValidator];

const useCases = [CreateUserUseCase];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    //MongooseModule.forFeature(schemes)
    //ThrottlerModule.forRoot({ ttl: 10, limit: 5 }),
  ],
  controllers: [...controllers],
  providers: [
    ...pipes,
    ...repositories,
    ...services,
    ...validators,
    ...useCases,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
