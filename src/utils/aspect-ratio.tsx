import { Movie } from "@/core/domain/movie";

export const getAspectRatio = (movies: Movie[]) => {
  const landscapeMovies = movies.filter(
    (movie) => movie.aspectRatio === "แนวนอน",
  );
  const portraitMovies = movies.filter(
    (movie) => movie.aspectRatio === "แนวตั้ง",
  );
  return { landscapeMovies, portraitMovies };
};
