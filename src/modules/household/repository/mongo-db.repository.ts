import mongoose from "mongoose";
import { Household } from "../../../shared/schema/householdModel";
import { HouseholdDocument, HouseholdMemberDocument } from "../household.types";
import { IHouseholdRepository } from "./household.repository";
import { HouseholdMember } from "../../../shared/schema/householdMemberModel";

export class MongoDbRepository implements IHouseholdRepository {
  async create(
    flatNumber: string,
    apartmentName: string,
    name: string | undefined,
    inviteCode: string,
    userId: string,
  ): Promise<HouseholdDocument> {
    const session = await mongoose.startSession();

    try {
      let household!: HouseholdDocument;

      await session.withTransaction(async () => {
        household = new Household({
          flatNumber,
          apartmentName,
          name,
          inviteCode,
        });

        await household.save({ session });

        const householdMember = new HouseholdMember({
          userId,
          householdId: household._id,
          role: "ADMIN",
          memberNumber: 1,
        });

        await householdMember.save({ session });
      });

      return household;
    } finally {
      await session.endSession();
    }
  }

  async join(
    householdId: string,
    userId: string,
  ): Promise<HouseholdMemberDocument> {
    const session = await mongoose.startSession();

    try {
      let householdMember!: HouseholdMemberDocument;
      await session.withTransaction(async () => {
        const lastMember = await HouseholdMember.findOne({ householdId })
          .sort({ memberNumber: -1 })
          .session(session);

        const nextMemberNumber = lastMember ? lastMember.memberNumber + 1 : 1;

        householdMember = new HouseholdMember({
          userId,
          householdId,
          role: "MEMBER",
          memberNumber: nextMemberNumber,
        });

        await householdMember.save({ session });
      });

      return householdMember;
    } finally {
      await session.endSession();
    }
  }

  //   async getHouseholdDetails(householdId: string): Promise<HouseholdDocument> {}

  //   async getHouseholdMembers(householdId: string): Promise<HouseholdDocument> {}

  //   async leave(householdId: string): Promise<HouseholdDocument> {}

  //   async regenerateInviteCode(householdId: string): Promise<HouseholdDocument> {}

  async findHousehold(
    flatNumber: string,
    apartmentName: string,
  ): Promise<HouseholdDocument | null> {
    return await Household.findOne({ flatNumber, apartmentName });
  }

  async findHouseholdByInviteCode(
    inviteCode: string,
  ): Promise<HouseholdDocument | null> {
    return await Household.findOne({ inviteCode });
  }
}

export const householdRepository = new MongoDbRepository();
