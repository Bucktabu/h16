import { EmailConfirmationRepository } from "../../../super-admin/infrastructure/emailConfirmation.repository";
import { BanInfoRepository } from "../../../super-admin/infrastructure/banInfo.repository";
import { UsersRepository } from "../../../super-admin/infrastructure/users.repository";
import { CreateUserUseCase } from "../../../super-admin/use-cases/create-user.use-case";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

//jest.setTimeout(100000000)

describe('Integration test for auth service',() => {

  let mongoServer: MongoMemoryServer
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  const banInfoRepository = new BanInfoRepository()
  const emailConfirmationRepository = new EmailConfirmationRepository()
  const usersRepository = new UsersRepository()
  const createUserUseCase = new CreateUserUseCase(banInfoRepository, emailConfirmationRepository, usersRepository)
  describe('create user', () => {
    beforeAll(async () => {
      await mongoose.connection.db.dropDatabase()
    })

    it('Should create and registrate user', async () => {
      const dto = {
        login: 'Login',
        password: 'password',
        email: 'someemail@mail.com'
      }
      const result = await createUserUseCase.execute(dto)
      const user = await result.user // TODO get don't resolve promise

      expect(user.login).toBe(dto.login)
      expect(result.email).toBe( dto.email)
    })
  })
})