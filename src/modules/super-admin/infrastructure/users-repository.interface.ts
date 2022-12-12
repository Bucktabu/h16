import { UserDBModel } from "./entity/userDB.model";
import { QueryParametersDTO } from "../../../global-model/query-parameters.dto";

export interface IUsersRepository {
  getUserByIdOrLoginOrEmail(IdOrLoginOrEmail: string): Promise<UserDBModel | null>
  getUsers(query: QueryParametersDTO): Promise<UserDBModel[]>
  getTotalCount(
    searchLoginTerm: string,
    searchEmailTerm: string,
  ): Promise<number>
  createUser(newUser: UserDBModel): Promise<UserDBModel | null>
  updateUserPassword(
    userId: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean>
  deleteUserById(userId: string): Promise<boolean>
}

export const IUsersRepository = 'IUsersRepository'