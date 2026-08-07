"use client";

import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import MovieCardPortrait from "../cards/movie-card-portrait";
import Link from "next/link";

interface Props {
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  orientation?: "landscape" | "portrait";
}

export default function MovieGrid({
  movies,
  onPlayClick,
  orientation = "landscape",
}: Props) {
  const gridClass =
    orientation === "landscape"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8";

  const CardComponent = orientation === "landscape" ? MovieCard : MovieCardPortrait;

  return (
    <div className={gridClass}>
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} key={movie.id}>
          <CardComponent
            movie={movie}
            onPlayClick={onPlayClick}
          />
        </Link>
      ))}
    </div>
  );
}
