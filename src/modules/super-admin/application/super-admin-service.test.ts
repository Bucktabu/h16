import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { isEmail, isUUID } from 'class-validator';
import {
  SortDirections,
  SortParametersModel,
} from '../../../global-model/sort-parameters.model';
import { BanInfoRepository } from '../infrastructure/ban-info/banInfo.repository';
import { EmailConfirmationRepository } from '../infrastructure/email-confirmation/email-confirmation.repository';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { UsersRepository } from '../infrastructure/users/users.repository';
import { SaBlogsService } from './sa-blogs-service';
import { PostsRepository } from "../../public/posts/infrastructure/posts.repository";
import { BanStatusModel } from "../../../global-model/ban-status.model";
import { BlogsRepository } from "../../public/blogs/infrastructure/blogs.repository";

//jest.setTimeout(100000000)

describe('Integration test for super admin service', () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const banInfoRepository = new BanInfoRepository();
  const emailConfirmationRepository = new EmailConfirmationRepository();
  const usersRepository = new UsersRepository();
  const createUserUseCase = new CreateUserUseCase(
    banInfoRepository,
    emailConfirmationRepository,
    usersRepository,
  );
  describe('create user', () => {
    beforeAll(async () => {
      await mongoose.connection.db.dropDatabase();
    });

    it('Should create and registrate user', async () => {
      const dto = {
        login: 'Login',
        password: 'password',
        email: 'someemail@mail.com',
      };
      const result = await createUserUseCase.execute(dto);
      const user = Promise.resolve(result.user);
      console.log(user);
      expect(result).toStrictEqual({
        user,
        email: dto.email,
        code: expect.any(String),
      });

      expect(isUUID(result.code)).toBe(true);
      expect(isEmail(result.email)).toBe(true);
      // stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi)

      expect(user).toStrictEqual({
        id: expect.any(String),
        login: dto.login,
        email: dto.email,
        createdAt: expect.stringMatching(
          /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
        ),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });
    });
  });

  const blogsRepository = new BlogsRepository();
  const userRepository = new UsersRepository();
  const postRepository = new PostsRepository();
  const saBlogsService = new SaBlogsService(banInfoRepository, blogsRepository, userRepository, postRepository);
  describe('Get blogs', () => {
    beforeAll(async () => {
      await mongoose.connection.db.dropDatabase();
    });

    it('Should get blogs with pagination, without query', async () => {
      const defaultQuery = {
        banStatus: BanStatusModel.All,
        sortBy: SortParametersModel.CreatedAt,
        sortDirection: SortDirections.Distending,
        pageNumber: 1,
        pageSize: 10,
        searchNameTerm: '',
        searchLoginTerm: '',
        searchEmailTerm: '',
      };

      const result = await saBlogsService.getBlogs(defaultQuery);
    });
  });
});
