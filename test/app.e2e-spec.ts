import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import request from 'supertest';
import { preparedUser } from "./helper/prepeared-data";
import { registrationNewUser } from "./helper/registration-user";
import { EmailAdapters } from "../src/modules/public/auth/email-transfer/email.adapter";
import { createNewUser } from "./helper/helpers";

jest.setTimeout(30000)

describe('e2e tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  it('Should return 400. So short input body and incorrect email', async () => {
    await registrationNewUser(request, app, preparedUser.short, 400, true)
  })

  it('Should return 400. So long input body and incorrect email', async () => {
    await registrationNewUser(request, app, preparedUser.long, 400, true)
  })

  it('Should registrate new user. Return 204.', async () => {
    await registrationNewUser(request, app, preparedUser.valid, 204, false)
  })

  it('', () => {
    const emailAdapterMock: jest.Mocked<EmailAdapters> = {
      sendEmail: jest.fn()
    }
    console.log(' ---> ', emailAdapterMock);
    //expect(emailAdapterMock.sendEmail).
  })

  it('', async () => {
    await createNewUser(request, app)
  })
});
