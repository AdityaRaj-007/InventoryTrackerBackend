import mongoose, { Schema } from "mongoose";

const householdSchema = new Schema(
  {
    flatNumber: {
      type: String,
      required: true,
    },
    apartmentName: { type: String, required: true },
    name: { type: String },
    inviteCode: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Household = mongoose.model("Households", householdSchema);
