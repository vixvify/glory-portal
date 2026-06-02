import { useState, useCallback } from "react";
import { Movie } from "@/core/domain/movie";

export function useMoviePlayer() {
  const [isPlayingMovie, setIsPlayingMovie] = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  const playMovie = useCallback((movie: Movie) => {
    setPlayingMovie(movie);
    setIsPlayingMovie(true);
  }, []);

  const stopMovie = useCallback(() => {
    setIsPlayingMovie(false);
  }, []);

  return {
    isPlayingMovie,
    playingMovie,
    playMovie,
    stopMovie,
  };
}
