import { NextFunction, Request, Response } from "express";
import { authService, AuthService } from "./auth.service";
import { LoginBody, SignUpBody } from "./auth.types";

export class AuthController {
  private readonly authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signup(
    req: Request<{}, {}, SignUpBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, email, password } = req.body;

      const data = await this.authService.userSignup(name, email, password);
      console.log(data);

      return res.status(201).json({
        success: true,
        data,
        error: null,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: null,
        error: "SERVER_ERROR",
      });
    }
  }

  async login(
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email, password } = req.body;
      const token = await this.authService.userLogin(email, password);

      return res.status(200).json({
        success: true,
        data: { token },
        error: null,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        data: null,
        error: "SERVER_ERROR",
      });
    }
  }
}

export const authController = new AuthController(authService);
