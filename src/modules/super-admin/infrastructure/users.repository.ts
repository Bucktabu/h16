import { Injectable } from '@nestjs/common';
import { giveSkipNumber } from '../../../helper.functions';
import { UserScheme } from './entity/users.scheme';
import { UserDBModel } from './entity/userDB.model';
import { QueryParametersDTO } from '../../../global-model/query-parameters.dto';

@Injectable()
export class UsersRepository {
  async getUserByIdOrLoginOrEmail(
    IdOrLoginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return UserScheme.findOne(
      {
        $or: [
          { id: IdOrLoginOrEmail },
          { login: IdOrLoginOrEmail },
          { email: IdOrLoginOrEmail },
        ],
      },
      { _id: false, __v: false },
    );
  }

  async getUsers(query: QueryParametersDTO): Promise<UserDBModel[]> {
    return UserScheme.find(
      {
        $or: [
          { login: { $regex: query.searchLoginTerm, $options: 'i' } },
          { email: { $regex: query.searchEmailTerm, $options: 'i' } },
        ],
      },
      { _id: false, passwordHash: false, passwordSalt: false, __v: false },
    )
      .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
      .skip(giveSkipNumber(query.pageNumber, query.pageSize))
      .limit(query.pageSize)
      .lean();
  }

  async getTotalCount(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number> {
    return UserScheme.countDocuments({
      $or: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });
  }

  async createUser(newUser: UserDBModel): Promise<UserDBModel | null> {
    try {
      await UserScheme.create(newUser);
      return newUser;
    } catch (e) {
      return null;
    }
  }

  async updateUserPassword(
    userId: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await UserScheme.updateOne(
      { id: userId },
      { $set: { passwordSalt, passwordHash } },
    );

    return result.matchedCount === 1;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await UserScheme.deleteOne({ id: userId });

    return result.deletedCount === 1;
  }
}
