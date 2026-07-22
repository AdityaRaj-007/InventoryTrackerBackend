import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayloadSchema } from "../../modules/auth/auth.schema";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.header("authorization");
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, data: null, error: "UNAUTHORIZED" });
  }

  const token = authHeader.split("Bearer ")[1];
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, data: null, error: "UNAUTHORIZED" });
  }
  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await JwtPayloadSchema.parseAsync(decoded);

    req.user = user;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, data: null, error: "UNAUTHORIZED" });
  }
};
