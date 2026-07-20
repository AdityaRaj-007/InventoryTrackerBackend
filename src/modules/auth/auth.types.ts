import z from "zod";
import {
  JwtPayloadSchema,
  LoginBodySchema,
  SignUpBodySchema,
} from "./auth.schema";
import { userSchema } from "../../shared/schema/userModel";
import { HydratedDocument, InferSchemaType } from "mongoose";

export type SignUpBody = z.infer<typeof SignUpBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
export type Users = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<Users>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
