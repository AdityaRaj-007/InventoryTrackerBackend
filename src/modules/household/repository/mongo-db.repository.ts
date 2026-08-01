import mongoose from "mongoose";
import { Household } from "../../../shared/schema/householdModel";
import {
  HouseholdDocument,
  HouseholdMemberDocument,
  HouseholdMemberWithUser,
  PopulatedHouseholdMember,
  PopulatedUser,
} from "../household.types";
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

  async findHouseholdMember(
    userId: string,
  ): Promise<HouseholdMemberDocument | null> {
    return await HouseholdMember.findOne({ userId });
  }

  async getMembersOfHousehold(
    householdId: string,
  ): Promise<HouseholdMemberWithUser[] | null> {
    const members = await HouseholdMember.find({ householdId })
      .populate<{ userId: PopulatedUser }>("userId", "_id name email")
      .lean<PopulatedHouseholdMember[]>();

    return members.map((member) => ({
      role: member.role,
      memberNumber: member.memberNumber,
      user: {
        id: member.userId._id.toString(),
        name: member.userId.name,
        email: member.userId.email,
      },
      householdId: member.householdId.toString(),
      joinedAt: member.joinedAt.toISOString(),
    }));
  }

  async getHouseholdDetails(
    householdId: string,
  ): Promise<HouseholdDocument | null> {
    return await Household.findById({ _id: householdId });
  }

  async leave(householdId: string, userId: string): Promise<void> {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        console.log(householdId);
        console.log(typeof householdId);
        const members = await HouseholdMember.find().session(session);

        console.log("Members list : " + members);

        await HouseholdMember.deleteOne({ userId, householdId }).session(
          session,
        );

        if (members.length < 1) {
          // delete the inventory for the household as last member also left
          return;
        }

        const oldestMember = await HouseholdMember.findOne({ householdId })
          .sort({ memberNumber: 1 })
          .session(session);

        console.log(oldestMember);

        if (!oldestMember) {
          throw new Error("No members found after deletion.");
        }

        await HouseholdMember.updateOne(
          { _id: oldestMember._id },
          { $set: { role: "ADMIN" } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
  }

  async updateInviteCode(
    householdId: string,
    newInviteCode: string,
  ): Promise<HouseholdDocument | null> {
    await Household.updateOne(
      { _id: householdId },
      { $set: { inviteCode: newInviteCode } },
    );

    return await Household.findOne({ _id: householdId });
  }
}

export const householdRepository = new MongoDbRepository();
