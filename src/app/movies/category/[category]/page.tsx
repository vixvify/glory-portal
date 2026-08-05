"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import MovieRow from "@/components/movie/rows/movie-row";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { useCategoriesQuery } from "@/hooks/db/use-master-data";
import { isEmptyAll } from "@/utils/check";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import Loading from "@/app/loading";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const categoryName = params.category
    ? decodeURIComponent(params.category)
    : "";

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();

  const { data: categories = [] } = useCategoriesQuery();
  const currentCategory = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  const categoryDisplayTitle = currentCategory
    ? (currentCategory.labelTh || currentCategory.name)
    : categoryName;

  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: moviesByCategory = [], isLoading: isLoadingCategory } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    aspectRatio: orientation,
  }, { placeholderData: keepPreviousData });

  const { data: moviesByViews = [], isLoading: isLoadingViews } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "views",
    aspectRatio: orientation,
  }, { placeholderData: keepPreviousData });

  const { data: moviesByRating = [], isLoading: isLoadingRating } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "averageRating",
    aspectRatio: orientation,
  }, { placeholderData: keepPreviousData });

  const { data: favorites = [] } = useFavoritesQuery(!!currentUser);
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
              showToast(FAVORITE_MESSAGES.TOAST.REMOVE_FAVORITE_SUCCESS, "info");
            } else {
              showToast(FAVORITE_MESSAGES.TOAST.ADD_FAVORITE_SUCCESS, "success");
            }
          },
          onError: () => {
            showToast(FAVORITE_MESSAGES.ERRORS.FAVORITE_UPDATE, "error");
          },
        },
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast, router],
  );

  const isPageLoading = isLoadingCategory || isLoadingViews || isLoadingRating;

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <main className="max-w-8xl mx-auto w-full px-6 md:px-16 pt-32 md:pt-36 pb-16 space-y-10 animate-fade-in">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        {isEmptyAll(moviesByCategory, moviesByViews, moviesByRating) ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์ในหมวดหมู่นี้
            </p>
          </div>
        ) : (
          <div className="space-y-12 pb-10">
            <>
              {moviesByCategory.length > 0 && (
                <MovieRow
                  title={categoryDisplayTitle}
                  movies={moviesByCategory}
                  onPlayClick={handlePlayMovie}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  orientation={orientation}
                />
              )}
              {moviesByViews.length > 0 && (
                <MovieRow
                  title={`${categoryDisplayTitle}ยอดนิยม`}
                  movies={moviesByViews}
                  onPlayClick={handlePlayMovie}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  orientation={orientation}
                />
              )}
              {moviesByRating.length > 0 && (
                <MovieRow
                  title={`${categoryDisplayTitle}ถูกใจผู้ชม`}
                  movies={moviesByRating}
                  onPlayClick={handlePlayMovie}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  orientation={orientation}
                />
              )}
            </>
          </div>
        )}
      </main>
    </div>
  );
}
