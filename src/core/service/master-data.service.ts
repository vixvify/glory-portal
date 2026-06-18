import { Category } from "../domain/movie";
import { MasterDataRepository } from "../ports/master-data.repository";
import { CrewRole } from "../domain/crew";

export class MasterDataService {
  constructor(private readonly masterDataRepository: MasterDataRepository) {}

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.masterDataRepository.getCategories();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getCategories:", error);
      throw error;
    }
  }

  async getUniversities(): Promise<string[]> {
    try {
      const response = await this.masterDataRepository.getUniversities();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getUniversities:", error);
      throw error;
    }
  }

  async getCrewRoles(): Promise<CrewRole[]> {
    try {
      const response = await this.masterDataRepository.getCrewRoles();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getCrewRoles:", error);
      throw error;
    }
  }

  async getMostActiveUniversity(): Promise<string> {
    try {
      const response = await this.masterDataRepository.getMostActiveUniversity();
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getMostActiveUniversity:", error);
      throw error;
    }
  }
}
