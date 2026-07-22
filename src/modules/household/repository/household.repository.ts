import { HouseholdDocument, HouseholdMemberDocument } from "../household.types";

export interface IHouseholdRepository {
  create(
    flatNumber: string,
    apartment: string,
    name: string | undefined,
    inviteCode: string,
    userId: string,
  ): Promise<HouseholdDocument>;

  join(userId: string, householdId: string): Promise<HouseholdMemberDocument>;

  //   getHouseholdDetails(householdId: string): Promise<HouseholdDocument>;

  //   getHouseholdMembers(householdId: string): Promise<HouseholdDocument>;

  //   leave(householdId: string): Promise<HouseholdDocument>;

  //   regenerateInviteCode(householdId: string): Promise<HouseholdDocument>;

  findHousehold(
    flatNumber: string,
    apartmentName: string,
  ): Promise<HouseholdDocument | null>;

  findHouseholdByInviteCode(
    inviteCode: string,
  ): Promise<HouseholdDocument | null>;
}
