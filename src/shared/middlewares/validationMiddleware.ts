import { NextFunction, Request, Response } from "express";
import { safeParseAsync, ZodError, ZodObject } from "zod";

type ValidationSchema = {
  body?: ZodObject;
  params?: ZodObject;
  query?: ZodObject;
};

export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const validatedReqBody = await schema.body.parseAsync(req.body);
        req.body = validatedReqBody;
      }

      if (schema.params) {
        const validatedReqParams = await schema.params.parseAsync(req.params);
        req.params = validatedReqParams as typeof req.params;
      }

      if (schema.query) {
        const validatedReqQuery = await schema.query.parseAsync(req.query);
        req.query = validatedReqQuery as typeof req.query;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          sucess: false,
          data: null,
          error: "INVALID_REQUEST",
        });
      }

      return res.status(500).json({
        success: false,
        data: null,
        error: "SERVER_ERROR",
      });
    }
  };
};
