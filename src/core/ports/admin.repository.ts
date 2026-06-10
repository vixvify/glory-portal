import { ApiResponse } from "@/core/ports/response";
import { AdminStats } from "../domain/admin";

export interface AdminRepository {
  getStats(): Promise<ApiResponse<AdminStats>>;
}
