import { ApiResponse } from "@/infra/interface/response";
import { Rating, RatingCheckInput, RatingInput } from "../domain/rating";

export interface RatingRepository {
  addRating(data: RatingInput): Promise<ApiResponse<void>>;
  checkRating(data: RatingCheckInput): Promise<ApiResponse<boolean>>;
  deleteRating(data: RatingCheckInput): Promise<ApiResponse<void>>;
  updateRating(data: RatingInput): Promise<ApiResponse<void>>;
  getRatingByMovieAndUser(data: RatingCheckInput): Promise<ApiResponse<Rating>>;
}
