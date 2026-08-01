import {
  HouseholdDocument,
  HouseholdMemberDocument,
  HouseholdMemberWithUser,
} from "../household.types";

export interface IHouseholdRepository {
  create(
    flatNumber: string,
    apartment: string,
    name: string | undefined,
    inviteCode: string,
    userId: string,
  ): Promise<HouseholdDocument>;

  join(userId: string, householdId: string): Promise<HouseholdMemberDocument>;

  findHousehold(
    flatNumber: string,
    apartmentName: string,
  ): Promise<HouseholdDocument | null>;

  findHouseholdByInviteCode(
    inviteCode: string,
  ): Promise<HouseholdDocument | null>;

  findHouseholdMember(userId: string): Promise<HouseholdMemberDocument | null>;

  getMembersOfHousehold(
    householdId: string,
  ): Promise<HouseholdMemberWithUser[] | null>;

  getHouseholdDetails(householdId: string): Promise<HouseholdDocument | null>;

  leave(householdId: string, userId: string): Promise<void>;

  updateInviteCode(
    householdId: string,
    newInviteCode: string,
  ): Promise<HouseholdDocument | null>;
}
