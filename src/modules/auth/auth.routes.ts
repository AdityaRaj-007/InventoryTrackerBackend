import Router from "express";
import { LoginBody, SignUpBody } from "./auth.types";
import { validate } from "../../shared/middlewares/validationMiddleware";
import { LoginBodySchema, SignUpBodySchema } from "./auth.schema";
import { authController } from "./auth.controller";

const router = Router();

router.post<{}, {}, SignUpBody>(
  "/signup",
  validate({ body: SignUpBodySchema }),
  authController.signup.bind(authController),
);

router.post<{}, {}, LoginBody>(
  "/login",
  validate({ body: LoginBodySchema }),
  authController.login.bind(authController),
);

export default router;
