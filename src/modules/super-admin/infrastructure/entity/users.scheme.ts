import mongoose, { Model } from "mongoose";
import { UserDBModel } from './userDB.model';
import { UserDTO } from "../../api/dto/userDTO";

const usersScheme = new mongoose.Schema<UserDBModel/*, UserModelStaticType*/>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const UserScheme = mongoose.model<UserDBModel/*, UserModelStaticType*/>('users', usersScheme);

// type UserModelStaticType = Model<UserDBModel> & {
//   makeInstance(id: string, dto: UserDTO, hash: any, createdAt: Date): any
// }
//
// usersScheme.static('makeInstance', function makeInstance(id: string, dto: UserDTO, hash: any, createdAt: string) {
//   return new UserDBModel(
//     id,
//     dto.login,
//     dto.email,
//     hash.passwordSalt,
//     hash.passwordHash,
//     createdAt,
//   )
// })
