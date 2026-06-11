"use client";

import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import Link from "next/link";

interface Props {
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
}

export default function MovieGrid({
  movies,
  onPlayClick,
  favorites,
  onToggleFavorite,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} key={movie.id}>
          <MovieCard
            movie={movie}
            onPlayClick={onPlayClick}
            isFavorite={favorites.some((fav) => fav.id === movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </Link>
      ))}
    </div>
  );
}
