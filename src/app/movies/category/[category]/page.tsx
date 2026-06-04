"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMoviesQuery } from "@/hooks/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/use-favorites";
import { useAppStore } from "@/store/use-store";
import MovieGrid from "@/components/movie/movie-grid";
import Loading from "@/app/loading";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMoviePlayer } from "@/hooks/use-movie-player";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const categoryName = params.category
    ? decodeURIComponent(params.category)
    : "";

  const { playMovie: handlePlayMovie } = useMoviePlayer();

  const { currentUser, showToast } = useAppStore();

  const { data: movies = [], isLoading } = useMoviesQuery({
    search: categoryName,
    searchby: "category",
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
    [currentUser, favorites, toggleFavoriteMutation, showToast],
  );

  if (isLoading) {
    return <Loading />;
  }

  const categoryDisplayTitle =
    CATEGORY_TITLE_MAPPING[categoryName] || categoryName;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-28 pb-16 space-y-8 animate-fade-in">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-brand cursor-pointer transition-colors bg-transparent border-none focus:outline-none"
          >
            <ArrowBackIcon className="text-sm" /> กลับ
          </button>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
            <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ภาพยนตร์แนว {categoryDisplayTitle}
            </h1>
            <span className="text-sm text-zinc-400 font-light">
              พบทั้งหมด {movies.length} เรื่อง
            </span>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์ในหมวดหมู่นี้
            </p>
          </div>
        ) : (
          <div className="pb-10">
            <MovieGrid
              movies={movies}
              onPlayClick={handlePlayMovie}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
      </main>


    </div>
  );
}
