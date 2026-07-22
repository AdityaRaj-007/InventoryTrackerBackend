import mongoose, { Schema } from "mongoose";

export const householdSchema = new Schema(
  {
    flatNumber: {
      type: String,
      required: true,
    },
    apartmentName: { type: String, required: true },
    name: { type: String },
    inviteCode: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

householdSchema.index({ flatNumber: 1, apartmentName: 1 }, { unique: true });

export const Household = mongoose.model("Households", householdSchema);
