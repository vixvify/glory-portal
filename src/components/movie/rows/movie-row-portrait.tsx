"use client";

import { Movie } from "@/core/domain/movie";
import MovieRow from "./movie-row";

interface MovieRowPortraitProps {
  title: string;
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
}

export default function MovieRowPortrait(props: MovieRowPortraitProps) {
  return <MovieRow {...props} orientation="portrait" />;
}
