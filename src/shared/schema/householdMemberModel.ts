import mongoose, { Schema } from "mongoose";

export const householdMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    householdId: {
      type: Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    role: { type: String, enum: ["ADMIN", "MEMBER"] },
    memberNumber: { type: Number, required: true, unique: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

householdMemberSchema.index(
  { householdId: 1, memberNumber: 1 },
  { unique: true },
);

export const HouseholdMember = mongoose.model(
  "HouseholdMember",
  householdMemberSchema,
);
