import { User } from "./user";
import { Movie } from "./movie";

export interface Rating {
  id: string;
  movieId: string;
  userId?: string;
  stars: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  movie: Movie;
  user: User;
}

export interface RatingInput {
  movieId: string;
  stars: number;
}

export interface RatingCheckInput {
  movieId: string;
}
