"use client";

import { useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import Loading from "@/app/loading";
import { useCrewMemberQueryById } from "@/hooks/db/use-crew-members";
import { useFavoritesQuery, useToggleFavoriteMutation } from "@/hooks/db/use-favorites";
import { useAppStore } from "@/store/use-store";
import { useMoviePlayer } from "@/hooks/system/use-movie-player";
import MovieCard from "@/components/movie/cards/movie-card";
import MovieCardPortrait from "@/components/movie/cards/movie-card-portrait";
import { Toast } from "@/components/ui/toast";

import { getCrewRoleLabel } from "@/core/constants/movie-form";

export default function CrewProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: crewMember,
    isLoading,
    error,
  } = useCrewMemberQueryById(params.id);

  const { playMovie: handlePlayMovie } = useMoviePlayer();
  const { currentUser, showToast } = useAppStore();
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

  const groupedMovies = useMemo(() => {
    if (!crewMember?.movies) return {};
    const groups: Record<string, typeof crewMember.movies> = {};

    crewMember.movies.forEach((mc) => {
      const roleTitle = getCrewRoleLabel(mc.role);

      if (!groups[roleTitle]) {
        groups[roleTitle] = [];
      }
      groups[roleTitle].push(mc);
    });

    return groups;
  }, [crewMember]);

  const crewRoles = useMemo(() => {
    return Object.keys(groupedMovies);
  }, [groupedMovies]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !crewMember) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold tracking-wide">
            ไม่พบข้อมูลทีมงาน
          </h2>
          <p className="text-sm text-zinc-400">
            ขออภัย ไม่พบประวัติหรือรายละเอียดของทีมงานท่านนี้ในระบบ
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-black font-semibold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2 justify-center mx-auto"
          >
            <ArrowBackIcon className="text-lg" /> กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-24">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-28 space-y-12 animate-fade-in">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Link
            href="/"
            className="hover:text-brand transition-colors flex items-center gap-1"
          >
            <ArrowBackIcon className="text-sm" /> หน้าหลัก
          </Link>
          <span>/</span>
          <span className="text-zinc-400">ทีมงานและนักแสดง</span>
          <span>/</span>
          <span className="text-zinc-200">{crewMember.name}</span>
        </div>

        <div className="relative overflow-hidden bg-card border border-zinc-800/40 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl">

          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-3 border-brand/50 shadow-2xl shrink-0 group aspect-square">
            {crewMember.user?.photoUrl ? (
              <Image
                src={crewMember.user.photoUrl}
                alt={crewMember.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                <PersonIcon className="text-6xl md:text-7xl" />
              </div>
            )}
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-1.5">
              <span className="text-xs font-bold tracking-widest text-brand uppercase bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md inline-block">
                CREW PROFILE
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-wide text-white drop-shadow-md">
                {crewMember.name}
              </h1>
            </div>

            {crewMember.email && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-450 hover:text-white transition-colors">
                <EmailIcon className="text-base text-brand" />
                <a href={`mailto:${crewMember.email}`}>{crewMember.email}</a>
              </div>
            )}

            {crewRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                {crewRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {crewRoles.length > 0 ? (
            Object.entries(groupedMovies).map(([roleTitle, items]) => (
              <div key={roleTitle} className="space-y-6 animate-fade-in">
                <div className="border-b border-zinc-800/80 pb-2.5 flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                    <span className="w-3 h-3 bg-brand rounded-full inline-block animate-pulse" />
                    บทบาทหน้าที่:{" "}
                    <span className="text-brand font-black">{roleTitle}</span>
                  </h2>
                  <span className="text-xs text-zinc-450 font-bold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                    ทั้งหมด {items.length} เรื่อง
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((mc) => {
                    const movie = mc.movie;
                    if (!movie) return null;

                    return (
                      <Link
                        href={`/movies/${movie.id}`}
                        key={mc.id}
                      >
                        {movie.aspectRatio === "portrait" || movie.aspectRatio === "portait" ? (
                          <MovieCardPortrait
                            movie={movie}
                            onPlayClick={handlePlayMovie}
                            isFavorite={favorites.some((fav) => fav.id === movie.id)}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ) : (
                          <MovieCard
                            movie={movie}
                            onPlayClick={handlePlayMovie}
                            isFavorite={favorites.some((fav) => fav.id === movie.id)}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-zinc-900/10 border border-zinc-800/30 p-12 text-center rounded-3xl">
              <p className="text-sm text-zinc-550 italic font-light">
                ยังไม่มีข้อมูลการมีส่วนร่วมในภาพยนตร์สำหรับสมาชิกทีมงานท่านนี้
              </p>
            </div>
          )}
        </div>
      </main>
      <Toast />
    </div>
  );
}
