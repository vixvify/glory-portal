import {
  CrewMember,
  CreateCrewMember,
  UpdateCrewMember,
  CrewFilterParams,
} from "../domain/movie";
import { CrewMemberRepository } from "../ports/crew-member.repository";
import { parseSchema } from "@/lib/validation";
import {
  crewFilterParamsSchema,
  createCrewMemberSchema,
  updateCrewMemberSchema,
} from "../schema/crew";

export class CrewMemberService {
  constructor(private readonly crewMemberRepository: CrewMemberRepository) {}

  async getCrewMembers(params?: CrewFilterParams): Promise<CrewMember[]> {
    try {
      if (params) {
        parseSchema(crewFilterParamsSchema, params);
      }
      const response = await this.crewMemberRepository.getCrewMembers(params);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getCrewMembers:", error);
      throw error;
    }
  }

  async getCrewMemberById(id: string): Promise<CrewMember> {
    try {
      const response = await this.crewMemberRepository.getCrewMemberById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(`Error in getCrewMemberById (id: ${id}):`, error);
      throw error;
    }
  }
  async createCrewMember(crewMember: CreateCrewMember): Promise<CrewMember> {
    try {
      const validated = parseSchema(createCrewMemberSchema, crewMember);
      const response =
        await this.crewMemberRepository.createCrewMember(validated);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in createCrewMember:", error);
      throw error;
    }
  }

  async updateCrewMember(
    id: string,
    crewMember: UpdateCrewMember,
  ): Promise<CrewMember> {
    try {
      const validated = parseSchema(updateCrewMemberSchema, crewMember);
      const response = await this.crewMemberRepository.updateCrewMember(
        id,
        validated,
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(`Error in updateCrewMember (id: ${id}):`, error);
      throw error;
    }
  }
  async deleteCrewMember(id: string): Promise<void> {
    try {
      const response = await this.crewMemberRepository.deleteCrewMember(id);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(`Error in deleteCrewMember (id: ${id}):`, error);
      throw error;
    }
  }
}
