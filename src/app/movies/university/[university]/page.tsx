"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMoviesQuery } from "@/hooks/db/use-movies";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import MovieGrid from "@/components/movie/grids/movie-grid";
import MovieCardPortrait from "@/components/movie/cards/movie-card-portrait";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import { isEmptyAll } from "@/utils/check";

export default function UniversityPage() {
  const params = useParams<{ university: string }>();
  const router = useRouter();
  const universityName = params.university
    ? decodeURIComponent(params.university)
    : "";

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();

  const { data: landscapeMovies = [] } = useMoviesQuery({
    search: universityName,
    searchby: "university",
    aspectRatio: "landscape",
  });

  const { data: portraitMovies = [] } = useMoviesQuery({
    search: universityName,
    searchby: "university",
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
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4">
            <h1 className="text-3xl text-3xl font-bold text-white">
              ผลงานจาก {universityName}
            </h1>
          </div>
        </div>

        {isEmptyAll(landscapeMovies, portraitMovies) ? (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-zinc-500 font-light">
              ไม่พบภาพยนตร์จากสถาบันนี้ในระบบ
            </p>
          </div>
        ) : (
          <div className="space-y-12 pb-10">
            {landscapeMovies.length > 0 && (
              <div className="space-y-5">
                <MovieGrid
                  movies={landscapeMovies}
                  onPlayClick={handlePlayMovie}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}

            {portraitMovies.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-lg md:text-xl font-bold text-zinc-200 tracking-wide border-l-3 border-brand pl-3">
                  ภาพยนตร์แนวตั้ง
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {portraitMovies.map((movie) => (
                    <Link href={`/movies/${movie.id}`} key={movie.id}>
                      <MovieCardPortrait
                        movie={movie}
                        onPlayClick={handlePlayMovie}
                        isFavorite={favorites.some(
                          (fav) => fav.id === movie.id,
                        )}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
