import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import mongoose  from "mongoose";

@Controller('testing')
export class TestingController {
  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    await mongoose.connection.db.dropDatabase();
    return HttpStatus.NO_CONTENT;
  }

  // @Delete('all-data')
  // @HttpCode(204)
  // async deleteAll() {
  //   const collections = connection.collections;
  //
  //   for (const key in collections) {
  //     const collection = collections[key];
  //     await collection.deleteMany({});
  //   }
  // }
}
