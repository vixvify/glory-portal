"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import MovieRow from "@/components/movie/rows/movie-row";
import MovieRowPortrait from "@/components/movie/rows/movie-row-portrait";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { isEmptyAll } from "@/utils/check";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const categoryName = params.category
    ? decodeURIComponent(params.category)
    : "";

  const { playMovie: handlePlayMovie } = useMoviePlayer();

  const { currentUser, showToast } = useAppStore();

  const { data: moviesByCategory = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    aspectRatio: "แนวนอน",
  });

  const { data: landscapeByViews = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "views",
    aspectRatio: "แนวนอน",
  });

  const { data: landscapeByRating = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "averageRating",
    aspectRatio: "แนวนอน",
  });

  const { data: portraitByViews = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "views",
    aspectRatio: "แนวตั้ง",
  });

  const { data: portraitByRating = [] } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
    sort: "desc",
    sortby: "averageRating",
    aspectRatio: "แนวตั้ง",
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
              showToast("นำออกจากรายการโปรดแล้ว", "info");
            } else {
              showToast("เพิ่มลงในรายการโปรดแล้ว", "success");
            }
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาดในการปรับปรุงรายการโปรด", "error");
          },
        },
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast, router],
  );

  const categoryDisplayTitle =
    CATEGORY_TITLE_MAPPING[categoryName] || categoryName;

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
