import { ApiResponse } from "@/core/ports/response";
import { Movie } from "../domain/movie";

export interface FavoriteRepository {
  getFavorites(): Promise<ApiResponse<Movie[]>>;
  addFavorite(movieId: string): Promise<ApiResponse<void>>;
  removeFavorite(movieId: string): Promise<ApiResponse<void>>;
}
