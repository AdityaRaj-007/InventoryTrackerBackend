import z from "zod";
import { CreateHouseholdSchema, JoinHouseholdSchema } from "./household.schema";
import { HydratedDocument, InferSchemaType } from "mongoose";
import { householdSchema } from "../../shared/schema/householdModel";
import { householdMemberSchema } from "../../shared/schema/householdMemberModel";

export type CreateHouseholdBody = z.infer<typeof CreateHouseholdSchema>;
export type Households = InferSchemaType<typeof householdSchema>;
export type HouseholdDocument = HydratedDocument<Households>;
export type JoinHouseholdBody = z.infer<typeof JoinHouseholdSchema>;
export type HouseholdMember = InferSchemaType<typeof householdMemberSchema>;
export type HouseholdMemberDocument = HydratedDocument<HouseholdMember>;
