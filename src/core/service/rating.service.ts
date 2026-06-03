import { Rating, RatingCheckInput, RatingInput } from "../domain/rating";
import { RatingRepository } from "../ports/rating.repository";
import { parseSchema } from "@/lib/validation";
import { ratingInputSchema, ratingCheckInputSchema } from "../schema/rating";

export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async addRating(data: RatingInput): Promise<void> {
    try {
      const validated = parseSchema(ratingInputSchema, data);
      const response = await this.ratingRepository.addRating(validated);
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
      const validated = parseSchema(ratingCheckInputSchema, data);
      const response = await this.ratingRepository.checkRating(validated);
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
      const validated = parseSchema(ratingCheckInputSchema, data);
      const response = await this.ratingRepository.deleteRating(validated);
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
      const validated = parseSchema(ratingInputSchema, data);
      const response = await this.ratingRepository.updateRating(validated);
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
      const validated = parseSchema(ratingCheckInputSchema, data);
      const response =
        await this.ratingRepository.getRatingByMovieAndUser(validated);
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
