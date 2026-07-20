import Router from "express";
import { validate } from "../../shared/middlewares/validationMiddleware";
import { CreateHouseholdSchema } from "./household.schema";
import { CreateHouseholdBody } from "./household.types";

const router = Router();

router.post<{}, {}, CreateHouseholdBody>(
  "/",
  validate({ body: CreateHouseholdSchema }),
);

export default router;
