import { ApiResponse } from "@/core/ports/response";
import { Category, MasterDataItem } from "../domain/master-data";
import { CrewRole } from "../domain/crew";

export interface MasterDataRepository {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getUniversities(): Promise<ApiResponse<MasterDataItem[]>>;
  getSchools(): Promise<ApiResponse<MasterDataItem[]>>;
  getLanguages(): Promise<ApiResponse<MasterDataItem[]>>;
  getSubtitles(): Promise<ApiResponse<MasterDataItem[]>>;
  getColorTypes(): Promise<ApiResponse<MasterDataItem[]>>;
  getContentWarnings(): Promise<ApiResponse<MasterDataItem[]>>;
  getAgeRatings(): Promise<ApiResponse<MasterDataItem[]>>;
  getCrewRoles(): Promise<ApiResponse<CrewRole[]>>;
  getMostActiveUniversity(): Promise<ApiResponse<string>>;
}

