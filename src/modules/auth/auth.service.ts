import { env } from "../../shared/config/env";
import { IAuthRepository } from "./repository/auth.repository";
import { authRepository } from "./repository/mongo-db.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private readonly authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async userSignup(name: string, email: string, password: string) {
    const userExists = await this.authRepository.findUserByEmail(email);

    if (userExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = await this.authRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    return {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      id: userData._id,
    };
  }

  async userLogin(email: string, password: string) {
    const userExists = await this.authRepository.findUserByEmail(email);

    if (!userExists) {
      const passwordMatched = await bcrypt.compare(password, env.dummyPassowrd);

      throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatched = await bcrypt.compare(password, userExists.password);

    if (!passwordMatched) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      { id: userExists._id, email: userExists.email },
      env.jwtSecret,
    );

    return token;
  }
}

export const authService = new AuthService(authRepository);
