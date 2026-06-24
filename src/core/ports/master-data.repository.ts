import { ApiResponse } from "@/core/ports/response";
import { Category } from "../domain/master-data";
import { CrewRole } from "../domain/crew";

export interface MasterDataRepository {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getUniversities(): Promise<ApiResponse<string[]>>;
  getSchools(): Promise<ApiResponse<string[]>>;
  getStudios(): Promise<ApiResponse<string[]>>;
  getCrewRoles(): Promise<ApiResponse<CrewRole[]>>;
  getMostActiveUniversity(): Promise<ApiResponse<string>>;
}

