import { ApiResponse } from "../interface/response";
import { MasterDataRepository } from "@/core/ports/master-data.repository";
import {
  Category,
  University,
  AgeRating,
  Language,
  TargetGroup,
} from "@/core/domain/movie";
import httpClient from "@/lib/http";

export class MasterDataRepositoryImpl implements MasterDataRepository {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await httpClient.get<Category[]>("/masterdata/categories");
    return response;
  }

  async getUniversities(): Promise<ApiResponse<University[]>> {
    const response = await httpClient.get<University[]>(
      "/masterdata/universities",
    );
    return response;
  }

  async getAgeRatings(): Promise<ApiResponse<AgeRating[]>> {
    const response = await httpClient.get<AgeRating[]>(
      "/masterdata/age-ratings",
    );
    return response;
  }

  async getLanguages(): Promise<ApiResponse<Language[]>> {
    const response = await httpClient.get<Language[]>("/masterdata/languages");
    return response;
  }

  async getTargetGroups(): Promise<ApiResponse<TargetGroup[]>> {
    const response = await httpClient.get<TargetGroup[]>(
      "/masterdata/target-groups",
    );
    return response;
  }
}
