import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/infra/container";
import {
  Movie,
  CreateMovie,
  MovieFilterParams,
  UpdateMovie,
} from "@/core/domain/movie";

export function useMoviesQuery(
  params?: MovieFilterParams,
  options?: { enabled?: boolean },
) {
  return useQuery<Movie[], Error>({
    queryKey: params ? ["movies", params] : ["movies"],
    queryFn: () => movieService.getMovies(params),
    ...options,
  });
}

export function useMyMoviesQuery(options?: { enabled?: boolean }) {
  return useQuery<Movie[], Error>({
    queryKey: ["movies", "my-movies"],
    queryFn: () => movieService.getMyMovies(),
    ...options,
  });
}

export function useMyContributedMoviesQuery(options?: { enabled?: boolean }) {
  return useQuery<Movie[], Error>({
    queryKey: ["movies", "my-contributions"],
    queryFn: () => movieService.getMyContributedMovies(),
    ...options,
  });
}

export function useMovieQueryById(id?: string) {
  return useQuery<Movie, Error>({
    queryKey: ["movie", id],
    queryFn: () => movieService.getMovieById(id!),
    enabled: !!id,
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
  return useMutation<Movie, Error, UpdateMovie>({
    mutationFn: (movie) => movieService.updateMovie(movie.id, movie),
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

export function useCategoryMoviesQuery(categoryName: string) {
  return useQuery<Movie[], Error>({
    queryKey: ["movies", { search: categoryName, searchby: "category", page: 1, pagesize: 10 }],
    queryFn: () =>
      movieService.getMovies({
        search: categoryName,
        searchby: "category",
        page: 1,
        pagesize: 10,
      }),
    enabled: !!categoryName,
  });
}
