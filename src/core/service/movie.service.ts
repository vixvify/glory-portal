import {
  Movie,
  CreateMovie,
  UpdateMovie,
  MovieFilterParams,
} from "../domain/movie";
import { MovieRepository } from "../ports/movie.repository";
import { parseSchema } from "@/lib/validation";
import { createMovieSchema, updateMovieSchema } from "../schema/movie";
import { parseStringOrArray } from "@/utils/parser";

export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}
  async getMovies(params?: MovieFilterParams): Promise<Movie[]> {
    try {
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
      const formData = new FormData();
      formData.append("title", validated.title);
      formData.append("description", validated.description);
      formData.append("category", validated.category);
      formData.append("youtubeUrl", validated.youtubeUrl);
      formData.append("year", String(validated.year));
      formData.append("matchRate", String(validated.matchRate));
      formData.append("ageRating", validated.ageRating);
      formData.append("duration", String(validated.duration));

      if (validated.university)
        formData.append("university", validated.university);

      const directors = parseStringOrArray(validated.director);
      directors.forEach((d) => formData.append("director", d));

      const producers = parseStringOrArray(validated.producer);
      producers.forEach((p) => formData.append("producer", p));

      const writers = parseStringOrArray(validated.writer);
      writers.forEach((w) => formData.append("writer", w));

      const castMembers = parseStringOrArray(validated.cast);
      castMembers.forEach((c) => formData.append("cast", c));

      const btsVideos = parseStringOrArray(validated.btsVideo);
      btsVideos.forEach((v) => formData.append("btsVideo", v));
      const btsPhotos = validated.btsPhotos;
      if (btsPhotos) {
        if (btsPhotos instanceof File) {
          formData.append("btsPhotos", btsPhotos);
        } else if (btsPhotos instanceof FileList) {
          for (let i = 0; i < btsPhotos.length; i++) {
            const file = btsPhotos.item(i);
            if (file) formData.append("btsPhotos", file);
          }
        } else if (Array.isArray(btsPhotos)) {
          for (const item of btsPhotos) {
            if (item instanceof File) {
              formData.append("btsPhotos", item);
            } else if (typeof item === "string") {
              formData.append("btsPhotos", item);
            }
          }
        } else if (typeof btsPhotos === "string") {
          formData.append("btsPhotos", btsPhotos);
        }
      }

      if (validated.thumbnail instanceof File) {
        formData.append("thumbnail", validated.thumbnail);
      }

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
      const formData = new FormData();
      formData.append("title", validated.title);
      formData.append("description", validated.description);
      formData.append("category", validated.category);
      formData.append("youtubeUrl", validated.youtubeUrl);
      formData.append("year", String(validated.year));
      formData.append("matchRate", String(validated.matchRate));
      formData.append("ageRating", validated.ageRating);
      formData.append("duration", String(validated.duration));

      if (validated.university)
        formData.append("university", validated.university);

      const directors = parseStringOrArray(validated.director);
      directors.forEach((d) => formData.append("director", d));

      const producers = parseStringOrArray(validated.producer);
      producers.forEach((p) => formData.append("producer", p));

      const writers = parseStringOrArray(validated.writer);
      writers.forEach((w) => formData.append("writer", w));

      const castMembers = parseStringOrArray(validated.cast);
      castMembers.forEach((c) => formData.append("cast", c));

      const btsVideos = parseStringOrArray(validated.btsVideo);
      btsVideos.forEach((v) => formData.append("btsVideo", v));
      const btsPhotos = validated.btsPhotos;
      if (btsPhotos) {
        if (btsPhotos instanceof File) {
          formData.append("btsPhotos", btsPhotos);
        } else if (btsPhotos instanceof FileList) {
          for (let i = 0; i < btsPhotos.length; i++) {
            const file = btsPhotos.item(i);
            if (file) formData.append("btsPhotos", file);
          }
        } else if (Array.isArray(btsPhotos)) {
          for (const item of btsPhotos) {
            if (item instanceof File) {
              formData.append("btsPhotos", item);
            } else if (typeof item === "string") {
              formData.append("btsPhotos", item);
            }
          }
        } else if (typeof btsPhotos === "string") {
          formData.append("btsPhotos", btsPhotos);
        }
      }

      if (validated.thumbnail instanceof File) {
        formData.append("thumbnail", validated.thumbnail);
      } else if (
        validated.thumbnail &&
        typeof validated.thumbnail === "object" &&
        "length" in validated.thumbnail &&
        typeof validated.thumbnail !== "string"
      ) {
        const list = validated.thumbnail as unknown as FileList;
        if (list.length > 0) {
          formData.append("thumbnail", list[0] as File);
        }
      } else if (typeof validated.thumbnail === "string") {
        formData.append("thumbnail", validated.thumbnail);
      }

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
