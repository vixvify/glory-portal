import { ApiResponse } from "@/core/ports/response";
import { Category, University, AgeRating, Language, TargetGroup } from "../domain/movie";

export interface MasterDataRepository {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getUniversities(): Promise<ApiResponse<University[]>>;
  getAgeRatings(): Promise<ApiResponse<AgeRating[]>>;
  getLanguages(): Promise<ApiResponse<Language[]>>;
  getTargetGroups(): Promise<ApiResponse<TargetGroup[]>>;
}
