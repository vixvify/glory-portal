import { ApiResponse } from "../interface/response";
import { AdminRepository } from "@/core/ports/admin.repository";
import { AdminStats } from "@/core/domain/admin";
import httpClient from "@/lib/http";

export class AdminRepositoryImpl implements AdminRepository {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    return await httpClient.get<AdminStats>("/admin/stats");
  }
}
