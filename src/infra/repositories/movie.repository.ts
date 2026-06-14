import { ApiResponse } from "../interface/response";
import { MovieRepository } from "@/core/ports/movie.repository";
import { Movie, MovieFilterParams } from "@/core/domain/movie";
import httpClient from "@/lib/http";

export class MovieRepositoryImpl implements MovieRepository {
  async getMovies(params?: MovieFilterParams): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>("/movie", { params });
    return response;
  }

  async getMyMovies(): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>("/movie/my-movies");
    return response;
  }

  async getMyContributedMovies(): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>("/movie/my-contributions");
    return response;
  }

  async getMovieById(id: string): Promise<ApiResponse<Movie>> {
    const response = await httpClient.get<Movie>(`/movie/${id}`);
    return response;
  }

  async getMoviesByCategory(category: string): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>(
      `/movie/category/${category}`,
    );
    return response;
  }

  async getMovieWithAward(): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>(`/movie/movies-with-award`);
    return response;
  }

  async getMoviesByUniversity(
    university: string,
  ): Promise<ApiResponse<Movie[]>> {
    const response = await httpClient.get<Movie[]>(
      `/movie/university/${university}`,
    );
    return response;
  }

  async createMovie(formData: FormData): Promise<ApiResponse<Movie>> {
    const response = await httpClient.post<Movie>("/movie", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  async updateMovie(
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<Movie>> {
    const response = await httpClient.put<Movie>(`/movie/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  async deleteMovie(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(`/movie/${id}`);
    return response;
  }
}
