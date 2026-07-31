"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import { FAVORITE_MESSAGES } from "@/core/constants/favorite-messages";
import MovieRow from "@/components/movie/rows/movie-row";
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { useCategoriesQuery } from "@/hooks/db/use-master-data";
import { isEmptyAll } from "@/utils/check";

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

  const { data: moviesByCategory = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    aspectRatio: "landscape",
  });

  const { data: landscapeByViews = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "views",
    aspectRatio: "landscape",
  });

  const { data: landscapeByRating = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "averageRating",
    aspectRatio: "landscape",
  });

  const { data: portraitByViews = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "views",
    aspectRatio: "portrait",
  });

  const { data: portraitByRating = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "averageRating",
    aspectRatio: "portrait",
  });

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <main className="max-w-8xl mx-auto w-full px-6 md:px-16 pt-28 pb-16 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-brand/40 hover:text-brand flex items-center justify-center text-zinc-400 cursor-pointer transition-all duration-300 shadow-md focus:outline-none"
            aria-label="ย้อนกลับ"
          >
            <ArrowBackIcon className="text-sm" />
          </button>
        </div>

        {isEmptyAll(
          landscapeByViews,
          landscapeByRating,
          portraitByViews,
          portraitByRating,
        ) ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์ในหมวดหมู่นี้
            </p>
          </div>
        ) : (
          <div className="space-y-12 pb-10">
            {moviesByCategory.length > 0 && (
              <MovieRow
                title={categoryDisplayTitle}
                movies={moviesByCategory}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {landscapeByViews.length > 0 && (
              <MovieRow
                title={`${categoryDisplayTitle}ยอดนิยม`}
                movies={landscapeByViews}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {landscapeByRating.length > 0 && (
              <MovieRow
                title={`${categoryDisplayTitle}ถูกใจผู้ชม`}
                movies={landscapeByRating}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {portraitByViews.length > 0 && (
              <MovieRowPortrait
                title={`${categoryDisplayTitle}แนวตั้งยอดนิยม`}
                movies={portraitByViews}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {portraitByRating.length > 0 && (
              <MovieRowPortrait
                title={`${categoryDisplayTitle}แนวตั้งถูกใจผู้ชม`}
                movies={portraitByRating}
                onPlayClick={handlePlayMovie}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
