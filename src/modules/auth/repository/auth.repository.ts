import { UserDocument } from "../auth.types";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<UserDocument | null>;
  createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDocument>;
}
