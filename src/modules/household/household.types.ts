import z from "zod";
import { CreateHouseholdSchema, JoinHouseholdSchema } from "./household.schema";
import { HydratedDocument, InferSchemaType, Types } from "mongoose";
import { householdSchema } from "../../shared/schema/householdModel";
import { householdMemberSchema } from "../../shared/schema/householdMemberModel";
import { UserDocument, Users } from "../auth/auth.types";

export type CreateHouseholdBody = z.infer<typeof CreateHouseholdSchema>;
export type Households = InferSchemaType<typeof householdSchema>;
export type HouseholdDocument = HydratedDocument<Households>;
export type JoinHouseholdBody = z.infer<typeof JoinHouseholdSchema>;
export type HouseholdMember = InferSchemaType<typeof householdMemberSchema>;
export type HouseholdMemberDocument = HydratedDocument<HouseholdMember>;
export type HouseholdMemberWithUser = {
  role: "ADMIN" | "MEMBER";
  memberNumber: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  householdId: string;
};

export type PopulatedUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
};

export type PopulatedHouseholdMember = Omit<HouseholdMember, "userId"> & {
  userId: PopulatedUser;
};
