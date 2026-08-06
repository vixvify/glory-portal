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

  const CardComponent = orientation === "landscape" ? MovieCard : MovieCardPortrait;

  return (
    <div className={gridClass}>
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} key={movie.id}>
          <CardComponent
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
