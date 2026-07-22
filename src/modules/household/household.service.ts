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
}

export const householdService = new HouseholdService(householdRepository);
