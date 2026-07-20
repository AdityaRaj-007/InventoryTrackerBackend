import z from "zod";

export const CreateHouseholdSchema = z.object({
  flatNumber: z.string(),
  apartmentName: z.string(),
  name: z.string().optional(),
});
