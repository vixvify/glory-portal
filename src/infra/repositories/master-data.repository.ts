import { ApiResponse } from "../interface/response";
import { MasterDataRepository } from "@/core/ports/master-data.repository";
import { Category } from "@/core/domain/master-data";
import { CrewRole } from "@/core/domain/crew";
import httpClient from "@/lib/http";

export class MasterDataRepositoryImpl implements MasterDataRepository {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await httpClient.get<Category[]>("/masterdata/categories");
    return response;
  }

  async getUniversities(): Promise<ApiResponse<string[]>> {
    const response = await httpClient.get<string[]>("/masterdata/universities");
    return response;
  }

  async getCrewRoles(): Promise<ApiResponse<CrewRole[]>> {
    const response = await httpClient.get<CrewRole[]>("/masterdata/crew-roles");
    return response;
  }
}

