import { Controller, Delete, HttpCode } from '@nestjs/common';
import { connection } from "mongoose";

@Controller('testing')
export class TestingController {
  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    const collections = connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}
