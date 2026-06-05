import { ApiResponse } from "../interface/response";
import { CrewMemberRepository } from "@/core/ports/crew-member.repository";
import { CrewMember, CrewFilterParams, CreateCrewMember, UpdateCrewMember } from "@/core/domain/movie";
import httpClient from "@/lib/http";

export class CrewMemberRepositoryImpl implements CrewMemberRepository {
  async getCrewMembers(
    params?: CrewFilterParams,
  ): Promise<ApiResponse<CrewMember[]>> {
    return await httpClient.get<CrewMember[]>("/crew-members", { params });
  }

  async getMyCrewMembers(): Promise<ApiResponse<CrewMember[]>> {
    return await httpClient.get<CrewMember[]>("/crew-members/my-crew");
  }

  async getCrewMemberById(id: string): Promise<ApiResponse<CrewMember>> {
    return await httpClient.get<CrewMember>(`/crew-members/${id}`);
  }

  async createCrewMember(crewMember: CreateCrewMember): Promise<ApiResponse<CrewMember>> {
    return await httpClient.post<CrewMember>("/crew-members", crewMember);
  }

  async updateCrewMember(
    id: string,
    crewMember: UpdateCrewMember,
  ): Promise<ApiResponse<CrewMember>> {
    return await httpClient.put<CrewMember>(`/crew-members/${id}`, crewMember);
  }

  async deleteCrewMember(id: string): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>(`/crew-members/${id}`);
  }
}
