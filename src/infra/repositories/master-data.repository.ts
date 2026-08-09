import { ApiResponse } from "../interface/response";
import { MasterDataRepository } from "@/core/ports/master-data.repository";
import { Category, MasterDataItem } from "@/core/domain/master-data";
import { CrewRole } from "@/core/domain/crew";
import httpClient from "@/lib/http";

export class MasterDataRepositoryImpl implements MasterDataRepository {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await httpClient.get<Category[]>("/masterdata/categories");
    return response;
  }

  async getUniversities(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/universities");
    return response;
  }

  async getSchools(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/schools");
    return response;
  }

  async getLanguages(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/languages");
    return response;
  }

  async getSubtitles(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/subtitles");
    return response;
  }

  async getColorTypes(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/color-types");
    return response;
  }

  async getContentWarnings(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/content-warnings");
    return response;
  }

  async getAgeRatings(): Promise<ApiResponse<MasterDataItem[]>> {
    const response = await httpClient.get<MasterDataItem[]>("/masterdata/age-ratings");
    return response;
  }



  async getCrewRoles(): Promise<ApiResponse<CrewRole[]>> {
    const response = await httpClient.get<CrewRole[]>("/masterdata/crew-roles");
    return response;
  }

  async getMostActiveUniversity(): Promise<ApiResponse<string>> {
    const response = await httpClient.get<string>("/masterdata/active-university");
    return response;
  }
}

