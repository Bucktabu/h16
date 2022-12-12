import { EmailConfirmationRepository } from '../../../super-admin/infrastructure/email-confirmation/email-confirmation.repository';
import { BanInfoRepository } from '../../../super-admin/infrastructure/ban-info/banInfo.repository';
import { UsersRepository } from '../../../super-admin/infrastructure/users/users.repository';
import { CreateUserUseCase } from '../../../super-admin/use-cases/create-user.use-case';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { isEmail, isUUID } from 'class-validator';
import { SaBlogsRepository } from '../../../super-admin/infrastructure/sa-blogs/sa-blogs.repository';
import { SaBlogsService } from '../../../super-admin/application/sa-blogs-service';

//jest.setTimeout(100000000)

describe('Integration test for auth service', () => {
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
});
