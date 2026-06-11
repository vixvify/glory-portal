import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "@/infra/container";
import { CreateRating, UpdateRating, RatingParams, Rating } from "@/core/domain/rating";

export function useMovieUserRatingQuery(
  movieId: string,
  enabled = true,
) {
  return useQuery<Rating | null, Error>({
    queryKey: ["movie-rating", movieId],
    queryFn: () => ratingService.getRatingByMovieAndUser({ movieId }),
    enabled: enabled && !!movieId,
  });
}

export function useAddRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CreateRating>({
    mutationFn: (data) => ratingService.addRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId],
      });
    },
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateRating>({
    mutationFn: (data) => ratingService.updateRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId],
      });
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RatingParams>({
    mutationFn: (data) => ratingService.deleteRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.movieId] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId],
      });
    },
  });
}
