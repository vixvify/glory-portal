import { User } from "./user";
import { Movie } from "./movie";

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

export interface RatingInput {
  movieId: string;
  stars: number;
  comment?: string | null;
}

export interface RatingCheckInput {
  movieId: string;
}
