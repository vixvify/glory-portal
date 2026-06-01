import { ApiResponse } from "../interface/response";
import { RatingRepository } from "@/core/ports/rating.repository";
import { RatingCheckInput, RatingInput, Rating } from "@/core/domain/rating";
import httpClient from "@/lib/http";

export class RatingRepositoryImpl implements RatingRepository {
  async addRating(data: RatingInput): Promise<ApiResponse<void>> {
    return await httpClient.post<void>("/movie/ratings", data);
  }

  async checkRating(data: RatingCheckInput): Promise<ApiResponse<boolean>> {
    return await httpClient.get<boolean>("/movie/ratings/check", {
      params: data,
    });
  }

  async deleteRating(data: RatingCheckInput): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>("/movie/ratings", { data });
  }

  async updateRating(data: RatingInput): Promise<ApiResponse<void>> {
    return await httpClient.put<void>("/movie/ratings", data);
  }

  async getRatingByMovieAndUser(
    data: RatingCheckInput,
  ): Promise<ApiResponse<Rating>> {
    return await httpClient.get<Rating>(`/movie/ratings`, {
      params: data,
    });
  }
}
