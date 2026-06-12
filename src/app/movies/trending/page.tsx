"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import MovieRow from "@/components/movie/rows/movie-row";
import Loading from "@/app/loading";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";

export default function TrendingPage() {
  const router = useRouter();
  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();

  const { data: newMovies = [], isLoading: isLoadingNew } = useMoviesQuery({
    sort: "desc",
    sortby: "createdAt",
    page: 1,
    pagesize: 10,
    aspectRatio: "landscape",
  });

  const { data: popularNewMovies = [], isLoading: isLoadingPopNew } =
    useMoviesQuery({
      sort: "desc",
      sortby: "views",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });

  const { data: ratedNewMovies = [], isLoading: isLoadingRatedNew } =
    useMoviesQuery({
      sort: "desc",
      sortby: "averageRating",
      page: 1,
      pagesize: 10,
      aspectRatio: "landscape",
    });

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
      <main className="max-w-8xl mx-auto w-full px-6 md:px-16 pt-28 pb-16 space-y-10 animate-fade-in">
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-brand/40 hover:text-brand flex items-center justify-center text-zinc-400 cursor-pointer transition-all duration-300 shadow-md focus:outline-none"
            aria-label="ย้อนกลับ"
          >
            <ArrowBackIcon className="text-sm" />
          </button>
        </div>

        <div className="space-y-12">
          <MovieRow
            title="ใหม่"
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
        </div>
      </main>
    </div>
  );
}
