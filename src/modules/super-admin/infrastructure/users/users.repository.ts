import { Injectable } from '@nestjs/common';
import { giveSkipNumber } from '../../../../helper.functions';
import { UserScheme } from '../entity/users.scheme';
import { UserDBModel } from '../entity/userDB.model';
import { QueryParametersDto } from '../../../../global-model/query-parameters.dto';
import { IUsersRepository } from './users-repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
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

  async getUsers(query: QueryParametersDto): Promise<UserDBModel[]> {
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

  async getLogin(id: string): Promise<string | null> {
    try {
      const result = await UserScheme.findOne(
        { id },
        {
          _id: false,
          id: false,
          email: false,
          passwordHash: false,
          passwordSalt: false,
          createdAt: false,
          __v: false,
        },
      );
      return result.login;
    } catch (e) {
      return null;
    }
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

  // async save(model) {
  //   await model.save()
  // }

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
