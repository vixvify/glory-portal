import { ApiResponse } from "@/core/ports/response";
import { Rating, RatingParams, CreateRating, UpdateRating } from "../domain/rating";

export interface RatingRepository {
  addRating(data: CreateRating): Promise<ApiResponse<void>>;
  checkRating(data: RatingParams): Promise<ApiResponse<boolean>>;
  deleteRating(data: RatingParams): Promise<ApiResponse<void>>;
  updateRating(data: UpdateRating): Promise<ApiResponse<void>>;
  getRatingByMovieAndUser(data: RatingParams): Promise<ApiResponse<Rating | null>>;
}
