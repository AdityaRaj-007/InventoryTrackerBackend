import { User } from "../../../shared/schema/userModel";
import { UserDocument } from "../auth.types";
import { IAuthRepository } from "./auth.repository";

export class MongoAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const user = new User({ email, name, password });
    return await user.save();
  }
}

export const authRepository = new MongoAuthRepository();
