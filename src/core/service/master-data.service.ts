import { Category, MasterDataItem } from "../domain/master-data";
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

  async getUniversities(): Promise<MasterDataItem[]> {
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

  async getSchools(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getSchools();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getSchools:", error);
      throw error;
    }
  }

  async getLanguages(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getLanguages();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getLanguages:", error);
      throw error;
    }
  }

  async getSubtitles(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getSubtitles();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getSubtitles:", error);
      throw error;
    }
  }

  async getColorTypes(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getColorTypes();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getColorTypes:", error);
      throw error;
    }
  }

  async getContentWarnings(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getContentWarnings();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getContentWarnings:", error);
      throw error;
    }
  }

  async getAgeRatings(): Promise<MasterDataItem[]> {
    try {
      const response = await this.masterDataRepository.getAgeRatings();
      if (response.error) throw new Error(response.error);
      return response.data;
    } catch (error) {
      console.error("Error in getAgeRatings:", error);
      throw error;
    }
  }  async getCrewRoles(): Promise<CrewRole[]> {
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
