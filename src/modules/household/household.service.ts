import { IHouseholdRepository } from "./repository/household.repository";
import { householdRepository } from "./repository/mongo-db.repository";
import { generate } from "short-uuid";
export class HouseholdService {
  private readonly householdRepository: IHouseholdRepository;
  constructor(householdRepository: IHouseholdRepository) {
    this.householdRepository = householdRepository;
  }

  async createHousehold(
    flatNumber: string,
    apartmentName: string,
    name: string | undefined,
    userId: string,
  ) {
    const householdExists = await this.householdRepository.findHousehold(
      flatNumber,
      apartmentName,
    );

    if (householdExists) {
      throw new Error("HOUSEHOLD_EXISTS");
    }

    const inviteCode = generate();

    const data = await this.householdRepository.create(
      flatNumber,
      apartmentName,
      name,
      inviteCode,
      userId,
    );

    return {
      flatNumber: data.flatNumber,
      id: data._id,
      apartmentName: data.apartmentName,
      inviteCode: data.inviteCode,
    };
  }

  async joinHousehold(inviteCode: string, userId: string) {
    const validInviteCode =
      await this.householdRepository.findHouseholdByInviteCode(inviteCode);

    if (!validInviteCode) {
      throw new Error("INVALID_CODE");
    }

    const householdId = validInviteCode._id.toString();

    const data = await this.householdRepository.join(householdId, userId);

    return { householdId: data.householdId, role: data.role };
  }

  async getHouseholdDetails(userId: string) {
    const isMemberOfHousehold =
      await this.householdRepository.findHouseholdMember(userId);

    if (!isMemberOfHousehold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    }

    const householdId = isMemberOfHousehold.householdId.toString();

    const householdDetails =
      await this.householdRepository.getHouseholdDetails(householdId);

    if (!householdDetails) {
      throw new Error("HOUSEHOLD_DOES_NOT_EXISTS");
    }

    const membersInHousehold =
      await this.householdRepository.getMembersOfHousehold(householdId);

    let noOfMembersInHousehold;

    if (!membersInHousehold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    } else {
      noOfMembersInHousehold = membersInHousehold.length;
    }

    const isAdmin = isMemberOfHousehold.role === "ADMIN";

    return {
      id: householdDetails._id,
      name: householdDetails.name,
      flatNumber: householdDetails.flatNumber,
      inviteCode: householdDetails.inviteCode,
      memberCount: noOfMembersInHousehold,
      isCurrentUserAdmin: isAdmin,
    };
  }

  async getHouseholdMembersList(userId: string) {
    const isMemberOfHousehold =
      await this.householdRepository.findHouseholdMember(userId);

    if (!isMemberOfHousehold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    }

    const householdId = isMemberOfHousehold.householdId.toString();

    const householdDetails =
      await this.householdRepository.getHouseholdDetails(householdId);

    if (!householdDetails) {
      throw new Error("HOUSEHOLD_DOES_NOT_EXISTS");
    }

    const membersOfHousehold =
      await this.householdRepository.getMembersOfHousehold(householdId);

    if (!membersOfHousehold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    }
    const data = membersOfHousehold.map((member) => {
      return { name: member.user.name, role: member.role };
    });

    return data;
  }

  async leaveHousehold(userId: string) {
    const isMemberOfHousehold =
      await this.householdRepository.findHouseholdMember(userId);

    console.log("Household member details : " + isMemberOfHousehold);

    if (!isMemberOfHousehold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    }

    const householdId = isMemberOfHousehold.householdId.toString();

    await this.householdRepository.leave(householdId, userId);
    console.log("Left household successfully");
  }

  async regenerateCode(userId: string) {
    const isMemberOfHoushold =
      await this.householdRepository.findHouseholdMember(userId);

    if (!isMemberOfHoushold) {
      throw new Error("NOT_MEMBER_OF_ANY_HOUSEHOLD");
    }

    const isAdmin = isMemberOfHoushold.role === "ADMIN";

    if (!isAdmin) {
      throw new Error("NOT_ADMIN_OF_HOUSEHOLD");
    }

    const newInviteCode = generate();
    const householdId = isMemberOfHoushold.householdId.toString();

    const data = await this.householdRepository.updateInviteCode(
      householdId,
      newInviteCode,
    );

    return data;
  }
}

export const householdService = new HouseholdService(householdRepository);
