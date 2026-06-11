"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useFavoritesQuery,
  useToggleFavoriteMutation,
} from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import MovieGrid from "@/components/movie/grids/movie-grid";
import Loading from "@/app/loading";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const router = useRouter();
  const { playMovie: handlePlayMovie } = useMoviePlayer();

  const { currentUser, showToast } = useAppStore();

  const { data: favorites = [], isLoading } = useFavoritesQuery(!!currentUser);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const handleToggleFavorite = useCallback(
    (movieId: string) => {
      if (!currentUser) {
        showToast("กรุณาเข้าสู่ระบบก่อนใช้งาน", "warning");
        return;
      }
      const isCurrentlyFavorite = favorites.some((m) => m.id === movieId);

      toggleFavoriteMutation.mutate(
        { movieId, isFavorite: isCurrentlyFavorite },
        {
          onSuccess: () => {
            if (isCurrentlyFavorite) {
              showToast("นำออกจากรายการของฉันแล้ว", "info");
            } else {
              showToast("เพิ่มลงในรายการของฉันแล้ว", "success");
            }
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาดในการปรับปรุงรายการ", "error");
          },
        },
      );
    },
    [currentUser, favorites, toggleFavoriteMutation, showToast],
  );

  if (isLoading && currentUser) {
    return <Loading />;
  }

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
              รายการของฉัน
            </h1>
            {currentUser && (
              <span className="text-sm text-zinc-400 font-light">
                ทั้งหมด {favorites.length} เรื่อง
              </span>
            )}
          </div>
        </div>

        {!currentUser ? (
          <div className="text-center py-28 max-w-md mx-auto space-y-6 bg-zinc-900/20 border border-zinc-900/60 p-8 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto">
              <LockIcon className="text-3xl" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wide">
                เข้าสู่ระบบเพื่อดูรายการของฉัน
              </h2>
              <p className="text-sm text-zinc-450 font-light leading-relaxed">
                บันทึกภาพยนตร์เรื่องโปรดของคุณไว้ที่นี่เพื่อรับชมภายหลังและติดตามรายการที่ชื่นชอบทั้งหมด
              </p>
            </div>
            <Button
              variant="brand"
              onClick={() => router.push("/auth/login")}
              className="w-full py-3"
            >
              เข้าสู่ระบบเลย
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-28 max-w-md mx-auto space-y-6 bg-zinc-900/20 border border-zinc-900/60 p-8 rounded-3xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700/40 flex items-center justify-center text-zinc-500 mx-auto">
              <FavoriteIcon className="text-3xl" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wide">
                ยังไม่มีรายการของฉัน
              </h2>
              <p className="text-sm text-zinc-450 font-light leading-relaxed">
                เพิ่มภาพยนตร์ที่คุณชอบลงในรายการโปรดโดยกดปุ่มเครื่องหมายบวก (+)
                เพื่อแสดงข้อมูลในหน้านี้
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="w-full py-3"
            >
              สำรวจภาพยนตร์
            </Button>
          </div>
        ) : (
          <div className="pb-10">
            <MovieGrid
              movies={favorites}
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
