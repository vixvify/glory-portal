import { ApiResponse } from "../interface/response";
import { RatingRepository } from "@/core/ports/rating.repository";
import { RatingParams, CreateRating, UpdateRating, Rating } from "@/core/domain/rating";
import httpClient from "@/lib/http";

export class RatingRepositoryImpl implements RatingRepository {
  async addRating(data: CreateRating): Promise<ApiResponse<void>> {
    return await httpClient.post<void>("/movie/ratings", data);
  }

  async checkRating(data: RatingParams): Promise<ApiResponse<boolean>> {
    return await httpClient.get<boolean>("/movie/ratings/check", {
      params: data,
    });
  }

  async deleteRating(data: RatingParams): Promise<ApiResponse<void>> {
    return await httpClient.delete<void>("/movie/ratings", { data });
  }

  async updateRating(data: UpdateRating): Promise<ApiResponse<void>> {
    return await httpClient.put<void>("/movie/ratings", data);
  }

  async getRatingByMovieAndUser(
    data: RatingParams,
  ): Promise<ApiResponse<Rating | null>> {
    return await httpClient.get<Rating | null>(`/movie/ratings`, {
      params: data,
    });
  }
}
