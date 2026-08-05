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
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { LayoutToggle, LayoutOrientation } from "@/components/ui/layout-toggle";

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
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <main className="max-w-8xl mx-auto w-full px-6 md:px-16 pt-32 md:pt-36 pb-16 space-y-10 animate-fade-in">
        <div className="flex justify-start">
          <LayoutToggle value={orientation} onChange={setOrientation} />
        </div>

        <div className="space-y-12">
          {orientation === "landscape" ? (
            <>
              <MovieRow
                title="มาใหม่"
                movies={newMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
              <MovieRow
                title="มาแรง"
                movies={popularNewMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
              <MovieRow
                title="ถูกใจผู้ชม"
                movies={ratedNewMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </>
          ) : (
            <>
              <MovieRowPortrait
                title="แนวตั้งมาใหม่"
                movies={newMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
              <MovieRowPortrait
                title="แนวตั้งมาแรง"
                movies={popularNewMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
              <MovieRowPortrait
                title="แนวตั้งถูกใจผู้ชม"
                movies={ratedNewMovies}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
