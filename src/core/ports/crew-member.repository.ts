import { ApiResponse } from "@/infra/interface/response";
import { CrewMember, CrewFilterParams, CreateCrewMember, UpdateCrewMember } from "../domain/movie";

export interface CrewMemberRepository {
  getCrewMembers(params?: CrewFilterParams): Promise<ApiResponse<CrewMember[]>>;
  getCrewMemberById(id: string): Promise<ApiResponse<CrewMember>>;
  createCrewMember(crewMember: CreateCrewMember): Promise<ApiResponse<CrewMember>>;
  updateCrewMember(
    id: string,
    crewMember: UpdateCrewMember,
  ): Promise<ApiResponse<CrewMember>>;
  deleteCrewMember(id: string): Promise<ApiResponse<void>>;
}
