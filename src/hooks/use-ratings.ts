import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "@/infra/container";
import { RatingInput, RatingCheckInput, Rating } from "@/core/domain/rating";

export function useMovieUserRatingQuery(
  movieId: string,
  userId: string,
  enabled = true,
) {
  return useQuery<Rating, Error>({
    queryKey: ["movie-rating", movieId, userId],
    queryFn: () => ratingService.getRatingByMovieAndUser({ movieId, userId }),
    enabled: enabled && !!movieId && !!userId,
  });
}

export function useAddRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RatingInput>({
    mutationFn: (data) => ratingService.addRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId, variables.userId],
      });
    },
  });
}

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RatingInput>({
    mutationFn: (data) => ratingService.updateRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId, variables.userId],
      });
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RatingCheckInput>({
    mutationFn: (data) => ratingService.deleteRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({
        queryKey: ["movie-rating", variables.movieId, variables.userId],
      });
    },
  });
}
