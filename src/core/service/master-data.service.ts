import { Category, Language } from "../domain/movie";
import { MasterDataRepository } from "../ports/master-data.repository";

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
}
