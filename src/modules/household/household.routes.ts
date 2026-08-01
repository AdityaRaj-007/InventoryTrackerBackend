import Router from "express";
import { validate } from "../../shared/middlewares/validationMiddleware";
import { CreateHouseholdSchema, JoinHouseholdSchema } from "./household.schema";
import { CreateHouseholdBody, JoinHouseholdBody } from "./household.types";
import { householdController } from "./household.controller";

const router = Router();

router.post<{}, {}, CreateHouseholdBody>(
  "/",
  validate({ body: CreateHouseholdSchema }),
  householdController.create.bind(householdController),
);

router.post<{}, {}, JoinHouseholdBody>(
  "/join",
  validate({ body: JoinHouseholdSchema }),
  householdController.joinHousehold.bind(householdController),
);

router.get(
  "/",
  householdController.getHouseholdDetails.bind(householdController),
);

router.get(
  "/members",
  householdController.getHouseholdMemberDetails.bind(householdController),
);

router.post(
  "/leave",
  householdController.leaveHousehold.bind(householdController),
);

router.post(
  "/invite-code/regenerate",
  householdController.regenrateInviteCode.bind(householdController),
);

export default router;
