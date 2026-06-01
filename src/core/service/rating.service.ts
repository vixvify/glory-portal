import { Rating, RatingCheckInput, RatingInput } from "../domain/rating";
import { RatingRepository } from "../ports/rating.repository";

export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async addRating(data: RatingInput): Promise<void> {
    try {
      const response = await this.ratingRepository.addRating(data);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in addRating:", error);
      throw error;
    }
  }

  async checkRating(data: RatingCheckInput): Promise<boolean> {
    try {
      const response = await this.ratingRepository.checkRating(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in checkRating:", error);
      throw error;
    }
  }

  async deleteRating(data: RatingCheckInput): Promise<void> {
    try {
      const response = await this.ratingRepository.deleteRating(data);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in deleteRating:", error);
      throw error;
    }
  }

  async updateRating(data: RatingInput): Promise<void> {
    try {
      const response = await this.ratingRepository.updateRating(data);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in updateRating:", error);
      throw error;
    }
  }

  async getRatingByMovieAndUser(data: RatingCheckInput): Promise<Rating> {
    try {
      const response =
        await this.ratingRepository.getRatingByMovieAndUser(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getRatingByMovieAndUser:", error);
      throw error;
    }
  }
}
