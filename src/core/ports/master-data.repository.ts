import { ApiResponse } from "@/core/ports/response";
import { Category } from "../domain/movie";

export interface MasterDataRepository {
  getCategories(): Promise<ApiResponse<Category[]>>;
  getUniversities(): Promise<ApiResponse<string[]>>;
}
