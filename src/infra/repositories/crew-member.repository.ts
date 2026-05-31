import { ApiResponse } from "../interface/response";
import { CrewMemberRepository } from "@/core/ports/crew-member.repository";
import { CrewMember, CrewFilterParams } from "@/core/domain/movie";
import httpClient from "@/lib/http";

export class CrewMemberRepositoryImpl implements CrewMemberRepository {
  async getCrewMembers(params?: CrewFilterParams): Promise<ApiResponse<CrewMember[]>> {
    return await httpClient.get<CrewMember[]>("/crew-members", { params });
  }

  async getCrewMemberById(id: string): Promise<ApiResponse<CrewMember>> {
    return await httpClient.get<CrewMember>(`/crew-members/${id}`);
  }

  async createCrewMember(formData: FormData): Promise<ApiResponse<CrewMember>> {
    return await httpClient.post<CrewMember>("/crew-members", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateCrewMember(
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<CrewMember>> {
    return await httpClient.put<CrewMember>(`/crew-members/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteCrewMember(id: string): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>(`/crew-members/${id}`);
  }
}
