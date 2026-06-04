import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/core/domain/movie";

export function useMoviePlayer() {
  const router = useRouter();

  const playMovie = useCallback((movie: Movie) => {
    router.push(`/watch/${movie.id}`);
  }, [router]);

  return {
    isPlayingMovie: false,
    playingMovie: null as Movie | null,
    playMovie,
    stopMovie: () => {},
  };
}
