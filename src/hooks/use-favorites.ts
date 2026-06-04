import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/infra/container";
import { Movie } from "@/core/domain/movie";
import { ToggleFavoriteMutationInput } from "@/core/domain/favorite";

export function useFavoritesQuery(enabled = true) {
  return useQuery<Movie[], Error>({
    queryKey: ["favorites"],
    queryFn: () => favoriteService.getFavorites(),
    enabled,
  });
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ToggleFavoriteMutationInput>({
    mutationFn: ({ movieId, isFavorite }) =>
      isFavorite
        ? favoriteService.removeFavorite(movieId)
        : favoriteService.addFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
