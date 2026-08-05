"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";
import { PageLayout } from "@/components/ui/page-layout";

export default function TrendingPage() {
  const router = useRouter();
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();
  const [orientation, setOrientation] = useState<LayoutOrientation>("landscape");

  const { data: newMovies = [], isLoading: isLoadingNew } = useMoviesQuery(
    {
      sort: "desc",
      sortby: "createdAt",
      page: 1,
      pagesize: 10,
      aspectRatio: orientation,
    },
    { placeholderData: keepPreviousData }
  );

  const { data: popularNewMovies = [], isLoading: isLoadingPopNew } =
    useMoviesQuery(
      {
        sort: "desc",
        sortby: "views",
        page: 1,
        pagesize: 10,
        aspectRatio: orientation,
      },
      { placeholderData: keepPreviousData }
    );

  const { data: ratedNewMovies = [], isLoading: isLoadingRatedNew } =
    useMoviesQuery(
      {
        sort: "desc",
        sortby: "averageRating",
        page: 1,
        pagesize: 10,
        aspectRatio: orientation,
      },
      { placeholderData: keepPreviousData }
    );

  const { data: favorites = [], isLoading: isLoadingFavs } =
    useFavoritesQuery(!!currentUser);
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

  const isPageLoading =
    isLoadingNew ||
    isLoadingPopNew ||
    isLoadingRatedNew ||
    (!!currentUser && isLoadingFavs);

  if (isPageLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <div className="space-y-12">
          <MovieRow
            title={orientation === "landscape" ? "มาใหม่" : "แนวตั้งมาใหม่"}
            movies={newMovies}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            orientation={orientation}
          />
          <MovieRow
            title={orientation === "landscape" ? "มาแรง" : "แนวตั้งมาแรง"}
            movies={popularNewMovies}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            orientation={orientation}
          />
          <MovieRow
            title={orientation === "landscape" ? "ถูกใจผู้ชม" : "แนวตั้งถูกใจผู้ชม"}
            movies={ratedNewMovies}
            onPlayClick={handlePlayMovie}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            orientation={orientation}
          />
        </div>
    </PageLayout>
  );
}
