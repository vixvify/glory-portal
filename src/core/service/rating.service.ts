import { Rating, RatingParams, CreateRating, UpdateRating } from "../domain/rating";
import { RatingRepository } from "../ports/rating.repository";
import { parseSchema } from "@/lib/validation";
import { createRatingSchema, updateRatingSchema, ratingParamsSchema } from "../schema/rating";

export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async addRating(data: CreateRating): Promise<void> {
    try {
      const validated = parseSchema(createRatingSchema, data);
      const response = await this.ratingRepository.addRating(validated);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in addRating:", error);
      throw error;
    }
  }

  async checkRating(data: RatingParams): Promise<boolean> {
    try {
      const validated = parseSchema(ratingParamsSchema, data);
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

  async deleteRating(data: RatingParams): Promise<void> {
    try {
      const validated = parseSchema(ratingParamsSchema, data);
      const response = await this.ratingRepository.deleteRating(validated);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in deleteRating:", error);
      throw error;
    }
  }

  async updateRating(data: UpdateRating): Promise<void> {
    try {
      const validated = parseSchema(updateRatingSchema, data);
      const response = await this.ratingRepository.updateRating(validated);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Error in updateRating:", error);
      throw error;
    }
  }

  async getRatingByMovieAndUser(data: RatingParams): Promise<Rating | null> {
    try {
      const validated = parseSchema(ratingParamsSchema, data);
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
