import { ApiResponse } from "@/infra/interface/response";
import { AdminStats } from "../domain/admin";

export interface AdminRepository {
  getStats(): Promise<ApiResponse<AdminStats>>;
}
