import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/infra/container";
import {
  Movie,
  CreateMovie,
  UpdateMovie,
  MovieFilterParams,
} from "@/core/domain/movie";

export function useMoviesQuery(params?: MovieFilterParams) {
  return useQuery<Movie[], Error>({
    queryKey: params ? ["movies", params] : ["movies"],
    queryFn: () => movieService.getMovies(params),
  });
}

export function useCreateMovieMutation() {
  const queryClient = useQueryClient();
  return useMutation<Movie, Error, CreateMovie>({
    mutationFn: (movie) => movieService.createMovie(movie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateMovieMutation() {
  const queryClient = useQueryClient();
  return useMutation<Movie, Error, { id: string; movie: UpdateMovie }>({
    mutationFn: ({ id, movie }) => movieService.updateMovie(id, movie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useDeleteMovieMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => movieService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useMovieByUniversityQuery(university: string) {
  return useQuery<Movie[], Error>({
    queryKey: ["movies-university", university],
    queryFn: () => movieService.getMoviesByUniversity(university),
  });
}
