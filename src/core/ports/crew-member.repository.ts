import { ApiResponse } from "@/infra/interface/response";
import { CrewMember, CrewFilterParams } from "../domain/movie";

export interface CrewMemberRepository {
  getCrewMembers(params?: CrewFilterParams): Promise<ApiResponse<CrewMember[]>>;
  getCrewMemberById(id: string): Promise<ApiResponse<CrewMember>>;
  createCrewMember(formData: FormData): Promise<ApiResponse<CrewMember>>;
  updateCrewMember(
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<CrewMember>>;
  deleteCrewMember(id: string): Promise<ApiResponse<void>>;
}
