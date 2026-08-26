import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";

export function useFavoriteHandler() {
  const router = useRouter();
  const { currentUser, showToast } = useAppStore();
  const { data: favorites = [], isLoading: isLoadingFavs } = useFavoritesQuery(
    !!currentUser
  );
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const handleToggleFavorite = useCallback(
    (movieId: string) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      const isCurrentlyFavorite = favorites.some((m) => m.id === movieId);

      toggleFavoriteMutation.mutate(
        { movieId, isFavorite: isCurrentlyFavorite },
        {
          onSuccess: () => {
            if (isCurrentlyFavorite) {
              showToast(
                FAVORITE_MESSAGES.TOAST.REMOVE_FAVORITE_SUCCESS,
                "info"
              );
            } else {
              showToast(
                FAVORITE_MESSAGES.TOAST.ADD_FAVORITE_SUCCESS,
                "success"
              );
            }
          },
          onError: () => {
            showToast(FAVORITE_MESSAGES.ERRORS.FAVORITE_UPDATE, "error");
          },
        }
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast, router]
  );

  return { favorites, handleToggleFavorite, isLoadingFavs };
}
