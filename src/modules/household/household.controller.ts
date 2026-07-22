import { NextFunction, Request, Response } from "express";
import { HouseholdService, householdService } from "./household.service";
import { CreateHouseholdBody, JoinHouseholdBody } from "./household.types";

export class HouseholdController {
  private readonly householdService: HouseholdService;
  constructor(householdService: HouseholdService) {
    this.householdService = householdService;
  }

  async create(
    req: Request<{}, {}, CreateHouseholdBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ success: false, data: null, error: "UNAUTHORIZED" });
      }
      const { flatNumber, apartmentName, name } = req.body;

      const { id, email } = user;

      const userId = id;

      const data = await this.householdService.createHousehold(
        flatNumber,
        apartmentName,
        name,
        userId,
      );

      return res.status(201).json({ success: true, data, error: null });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: null,
        error: "SERVER_ERROR",
      });
    }
  }

  async joinHousehold(
    req: Request<{}, {}, JoinHouseholdBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ success: false, data: null, error: "UNAUTHORIZED" });
      }

      const { id, email } = user;
      const { inviteCode } = req.body;
      const userId = id;

      const data = await this.householdService.joinHousehold(
        inviteCode,
        userId,
      );

      return res.status(200).json({ success: true, data, error: null });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, data: null, error: "SERVER_ERROR" });
    }
  }

  async getHouseholdDetails(req: Request, res: Response, next: NextFunction) {}
}

export const householdController = new HouseholdController(householdService);
