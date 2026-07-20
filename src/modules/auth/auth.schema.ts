import z from "zod";

export const SignUpBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const LoginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const JwtPayloadSchema = z.object({
  id: z.string(),
  email: z.email(),
});
