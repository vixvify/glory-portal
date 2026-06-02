import { AdminRepository } from "../ports/admin.repository";
import { AdminStats } from "../domain/admin";

export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getStats(): Promise<AdminStats> {
    try {
      const response = await this.adminRepository.getStats();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getStats:", error);
      throw error;
    }
  }
}
