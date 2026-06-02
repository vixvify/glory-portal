import {
  CrewMember,
  CreateCrewMember,
  UpdateCrewMember,
  CrewFilterParams,
} from "../domain/movie";
import { CrewMemberRepository } from "../ports/crew-member.repository";

export class CrewMemberService {
  constructor(private readonly crewMemberRepository: CrewMemberRepository) {}

  async getCrewMembers(params?: CrewFilterParams): Promise<CrewMember[]> {
    try {
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
      const formData = new FormData();
      formData.append("name", crewMember.name);
      if (crewMember.email) {
        formData.append("email", crewMember.email);
      }
      if (crewMember.photo) {
        formData.append("photo", crewMember.photo);
      }
      const response =
        await this.crewMemberRepository.createCrewMember(formData);
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
      const formData = new FormData();
      formData.append("name", crewMember.name);
      if (crewMember.email !== undefined && crewMember.email !== null) {
        formData.append("email", crewMember.email);
      }
      if (crewMember.photo instanceof File) {
        formData.append("photo", crewMember.photo);
      } else if (typeof crewMember.photo === "string") {
        formData.append("photo", crewMember.photo);
      }
      const response = await this.crewMemberRepository.updateCrewMember(
        id,
        formData,
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
