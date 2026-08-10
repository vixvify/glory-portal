import type { User } from "./user";
import type { Movie } from "./movie";

export interface Rating {
  id?: string;
  movieId: string;
  userId?: string;
  stars: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
  movie: Movie;
  user: User;
}

export interface CreateRating {
  movieId: string;
  stars: number;
  comment?: string | null;
}

export interface UpdateRating {
  movieId: string;
  stars: number;
  comment?: string | null;
}

export interface RatingParams {
  movieId: string;
}
