"use client";

import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import MovieCardPortrait from "../cards/movie-card-portrait";
import Link from "next/link";

interface Props {
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
  orientation?: "landscape" | "portrait";
}

export default function MovieGrid({
  movies,
  onPlayClick,
  favorites,
  onToggleFavorite,
  orientation = "landscape",
}: Props) {
  const gridClass =
    orientation === "landscape"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6";

  return (
    <div className={gridClass}>
      {movies.map((movie) => {
        const cardContent =
          orientation === "landscape" ? (
            <MovieCard
              movie={movie}
              onPlayClick={onPlayClick}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ) : (
            <MovieCardPortrait
              movie={movie}
              onPlayClick={onPlayClick}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          );

        return (
          <Link href={`/movies/${movie.id}`} key={movie.id}>
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
