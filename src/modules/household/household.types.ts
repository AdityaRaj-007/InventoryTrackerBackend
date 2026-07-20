import z from "zod";
import { CreateHouseholdSchema } from "./household.schema";

export type CreateHouseholdBody = z.infer<typeof CreateHouseholdSchema>;
