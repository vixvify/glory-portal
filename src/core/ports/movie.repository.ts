import { ApiResponse } from "@/infra/interface/response";
import { Movie, MovieFilterParams } from "../domain/movie";

export interface MovieRepository {
  getMovies(params?: MovieFilterParams): Promise<ApiResponse<Movie[]>>;
  getMyMovies(): Promise<ApiResponse<Movie[]>>;
  getMyContributedMovies(): Promise<ApiResponse<Movie[]>>;
  getMovieById(id: string): Promise<ApiResponse<Movie>>;
  getMoviesByCategory(category: string): Promise<ApiResponse<Movie[]>>;
  getMoviesByUniversity(university: string): Promise<ApiResponse<Movie[]>>;
  createMovie(formData: FormData): Promise<ApiResponse<Movie>>;
  updateMovie(id: string, formData: FormData): Promise<ApiResponse<Movie>>;
  deleteMovie(id: string): Promise<ApiResponse<void>>;
}
