import {
  Movie,
  CreateMovie,
  UpdateMovie,
  MovieFilterParams,
} from "../domain/movie";
import { MovieRepository } from "../ports/movie.repository";
import { parseSchema } from "@/lib/validation";
import {
  createMovieSchema,
  updateMovieSchema,
  movieFilterParamsSchema,
} from "../schema/movie";
import { toFormData } from "@/utils/form-data";

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}
  async getMovies(params?: MovieFilterParams): Promise<Movie[]> {
    try {
      if (params) {
        parseSchema(movieFilterParamsSchema, params);
      }
      const response = await this.movieRepository.getMovies(params);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in getMovies:", error);
      throw error;
    }
  }
  async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await this.movieRepository.getMovieById(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(`Error in getMovieById (id: ${id}):`, error);
      throw error;
    }
  }
  async getMoviesByCategory(category: string): Promise<Movie[]> {
    try {
      const response = await this.movieRepository.getMoviesByCategory(category);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(
        `Error in getMoviesByCategory (category: ${category}):`,
        error,
      );
      throw error;
    }
  }
  async createMovie(movie: CreateMovie): Promise<Movie> {
    try {
      const validated = parseSchema(createMovieSchema, movie);
      const formData = toFormData(validated);

      const response = await this.movieRepository.createMovie(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error("Error in createMovie:", error);
      throw error;
    }
  }
  async updateMovie(id: string, movie: UpdateMovie): Promise<Movie> {
    try {
      const validated = parseSchema(updateMovieSchema, movie);
      const formData = toFormData(validated);

      const response = await this.movieRepository.updateMovie(id, formData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(`Error in updateMovie (id: ${id}):`, error);
      throw error;
    }
  }
  async deleteMovie(id: string): Promise<void> {
    try {
      const response = await this.movieRepository.deleteMovie(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(`Error in deleteMovie (id: ${id}):`, error);
      throw error;
    }
  }
  async getMoviesByUniversity(university: string): Promise<Movie[]> {
    try {
      const response =
        await this.movieRepository.getMoviesByUniversity(university);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error(
        `Error in getMovieByUniversity (university: ${university}):`,
        error,
      );
      throw error;
    }
  }
}
