"use client";

import { useEffect, useState, useMemo } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { User } from "@/core/domain/user";
import { Button } from "@/components/ui/button";
import {
  useAddRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} from "@/hooks/use-ratings";
import { useMovieQueryById } from "@/hooks/use-movies";
import { useCallback } from "react";
import { useAppStore } from "@/store/use-store";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMovieUserRatingQuery } from "@/hooks/use-ratings";
import { calculateRatingStats } from "@/utils/rating";
import Loading from "@/app/loading";

export default function MovieDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const addRatingMutation = useAddRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const isRatingPending =
    addRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;
  const { currentUser, showToast } = useAppStore();

  const { data: movie, isLoading } = useMovieQueryById(params.id);
  const { data: userRating } = useMovieUserRatingQuery(
    movie?.id ?? "",
    currentUser?.id ?? "",
  );

  const [selectedStars, setSelectedStars] = useState(0);

  useEffect(() => {
    if (userRating) {
      setSelectedStars(userRating.stars);
    }
  }, [userRating]);

  const { averageRating, ratingCount } = calculateRatingStats(movie?.ratings);

  const handleAddRating = useCallback(
    (movieId: string, user: User, stars: number) => {
      addRatingMutation.mutate(
        { userId: user.id, movieId, stars },
        {
          onSuccess: () => {
            showToast("เพิ่มคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [addRatingMutation, showToast],
  );

  const handleUpdateRating = useCallback(
    (movieId: string, user: User, stars: number) => {
      updateRatingMutation.mutate(
        { userId: user.id, movieId, stars },
        {
          onSuccess: () => {
            showToast("แก้ไขคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [updateRatingMutation, showToast],
  );

  const handleDeleteRating = useCallback(
    (movieId: string, user: User) => {
      deleteRatingMutation.mutate(
        { userId: user.id, movieId },
        {
          onSuccess: () => {
            showToast("ลบคะแนนแล้ว", "success");
          },
          onError: () => {
            showToast("เกิดข้อผิดพลาด", "error");
          },
        },
      );
    },
    [deleteRatingMutation, showToast],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10 animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/40 bg-zinc-900/30">
          <div
            className="relative h-[420px] md:h-[520px] bg-cover bg-center"
            style={{
              backgroundImage: `
                linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.4) 60%, rgba(var(--theme-bg-rgb), 0.85) 100%),
                linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.95) 0%, rgba(var(--theme-bg-rgb), 0.3) 40%, transparent 100%),
                url(${movie?.thumbnail})
              `,
            }}
          >
            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-zinc-700/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 z-20"
              aria-label="ย้อนกลับ"
            >
              <ArrowBackIcon className="text-xl" />
            </button>

            <div className="absolute bottom-6 left-6 md:left-12 flex flex-wrap items-end gap-4 z-10 w-[90%]">
              <div>
                <div className="text-xs font-semibold tracking-widest text-brand mb-2.5 bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md inline-block">
                  GLORY ORIGINAL
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md mb-5 leading-tight">
                  {movie?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="white" size="md">
                    <PlayArrowIcon className="text-xl mr-1.5" />
                    เล่นตัวอย่าง
                  </Button>

                  <button className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-emerald-400 cursor-pointer transition-colors">
                    <CheckIcon className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm bg-zinc-900/30 border border-zinc-900/60 p-4 rounded-2xl w-full">
              <span className="text-emerald-400 font-bold tracking-tight">
                {movie?.matchRate}% ตรงกับคุณ
              </span>
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="text-zinc-400">{movie?.year}</span>
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="px-2 py-0.5 text-xs font-semibold border border-zinc-700 text-zinc-300 rounded bg-zinc-950/40">
                {movie?.ageRating}
              </span>
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="text-zinc-400">{movie?.duration} นาที</span>
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand/10 border border-brand/20 text-brand rounded-full">
                {movie?.category}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white tracking-wide">
                เรื่องย่อ
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed font-light">
                {movie?.description}
              </p>
            </div>

            <div className="space-y-5 pt-6 border-t border-zinc-800/60">
              <h4 className="text-base font-bold text-white tracking-wide uppercase">
                ทีมงานและนักแสดง
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie?.crew && movie.crew.length > 0 ? (
                  movie.crew.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3.5 bg-zinc-900/30 border border-zinc-800/40 p-3 rounded-2xl transition-all hover:bg-zinc-900/60 hover:border-zinc-700/40 group"
                    >
                      <img
                        src={
                          member.crewMember?.photoUrl ||
                          "https://placehold.co/100?text=" +
                            (member.crewMember?.name.charAt(0) || "C")
                        }
                        alt={member.crewMember?.name || "Crew Member"}
                        className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-zinc-700/50 group-hover:border-brand/40 transition-colors"
                      />
                      <div>
                        <p className="font-bold text-zinc-200 group-hover:text-brand transition-colors flex items-center gap-1.5">
                          {member.crewMember?.name}
                          {member.crewMember?.userId && (
                            <span
                              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                              title="ผู้ใช้งานระบบ"
                            />
                          )}
                        </p>
                        <p className="text-[10px] text-brand uppercase tracking-widest font-medium mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-550 italic font-light col-span-2">
                    ไม่มีข้อมูลทีมงานและนักแสดงสำหรับเรื่องนี้
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5 pt-6 border-t border-zinc-800/60">
              <h4 className="text-base font-bold text-white tracking-wide uppercase">
                เบื้องหลังการถ่ายทำ
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {movie?.bts && movie.bts.btsPhotos?.length > 0 ? (
                  movie.bts.btsPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden border border-zinc-800/80 aspect-video relative group cursor-pointer shadow-lg hover:border-brand/40 transition-all duration-300"
                    >
                      <img
                        src={photo}
                        alt="Behind the scenes"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800/80 aspect-video relative group shadow-lg col-span-2 sm:col-span-3">
                    <img
                      src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c"
                      alt=""
                      className="w-full h-52 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800/60">
              <h4 className="text-lg font-bold text-white tracking-wide">
                รีวิวจากผู้ชม ({movie?.ratings?.length || 0})
              </h4>

              <div className="space-y-3.5 max-w-2xl">
                {movie?.ratings && movie.ratings.length > 0 ? (
                  movie.ratings.slice(0, 5).map((rating) => (
                    <div
                      key={rating.id}
                      className="p-4 rounded-2xl bg-zinc-900/20 border border-zinc-850 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                        {(rating.user?.name || rating.user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-200">
                            {rating.user?.name ||
                              rating.user?.email ||
                              "ผู้ใช้งาน"}
                          </span>

                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) =>
                              idx < rating.stars ? (
                                <StarIcon key={idx} className="text-sm" />
                              ) : (
                                <StarBorderIcon
                                  key={idx}
                                  className="text-sm text-zinc-700"
                                />
                              ),
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                          {rating.comment ||
                            `ให้คะแนนเรื่องนี้ ${rating.stars} ดาว`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-550 italic font-light">
                    ยังไม่มีการเขียนรีวิวสำหรับภาพยนตร์เรื่องนี้
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/40 text-center space-y-4 shadow-xl">
              <span className="text-zinc-450 text-xs uppercase tracking-widest font-semibold block">
                คะแนนเฉลี่ยจากผู้ชม
              </span>

              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-5xl font-extrabold text-white tracking-tighter">
                  {averageRating > 0 ? averageRating : "0.0"}
                </span>
                <span className="text-zinc-550 text-base">/ 5.0</span>
              </div>

              <div className="flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starVal = idx + 1;
                  return starVal <= Math.round(averageRating) ? (
                    <StarIcon key={idx} className="text-amber-500 text-2xl" />
                  ) : (
                    <StarBorderIcon
                      key={idx}
                      className="text-zinc-750 text-2xl"
                    />
                  );
                })}
              </div>

              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                รวมทั้งหมด {ratingCount} โหวต
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 space-y-5 shadow-xl">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest text-center">
                {userRating ? "คะแนนของคุณ" : "ให้คะแนนหนังนี้"}
              </h5>

              <div className="flex justify-center gap-1.5">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starValue = idx + 1;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedStars(starValue)}
                      disabled={isRatingPending}
                      className="cursor-pointer hover:scale-110 active:scale-95 transition-transform focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                      aria-label={`ให้ ${starValue} คะแนน`}
                    >
                      {starValue <= selectedStars ? (
                        <StarIcon className="text-amber-500 text-3xl drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]" />
                      ) : (
                        <StarBorderIcon className="text-zinc-700 text-3xl" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!currentUser || !movie) {
                      showToast("กรุณาเข้าสู่ระบบก่อนโหวตคะแนน", "warning");
                      return;
                    }
                    if (userRating) {
                      handleUpdateRating(movie.id, currentUser, selectedStars);
                    } else {
                      handleAddRating(movie.id, currentUser, selectedStars);
                    }
                  }}
                  variant="brand"
                  size="md"
                  className="flex-1"
                  isLoading={isRatingPending}
                  disabled={isRatingPending}
                >
                  {userRating ? "แก้ไขคะแนน" : "ส่งคะแนน"}
                </Button>

                {userRating && (
                  <button
                    onClick={() => {
                      if (currentUser && movie) {
                        handleDeleteRating(movie.id, currentUser);
                        setSelectedStars(5);
                      }
                    }}
                    disabled={isRatingPending}
                    className="flex-1 bg-red-950/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-red-900/30 text-sm font-bold rounded-lg cursor-pointer transition-colors active:scale-95 flex items-center justify-center py-2.5 disabled:opacity-50 disabled:pointer-events-none"
                    title="ลบคะแนน"
                  >
                    ลบ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
