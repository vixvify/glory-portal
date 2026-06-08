"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useScrollRow } from "@/hooks/use-scroll-row";
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
import PlayerModal from "@/components/modal/player-modal";
import { useMoviePlayer } from "@/hooks/use-movie-player";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { getYouTubeId } from "@/utils/youtube";
import { getYouTubeBackgroundEmbedUrl } from "@/core/constants/youtube";

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
    !!currentUser,
  );

  const [selectedStars, setSelectedStars] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const { playMovie } = useMoviePlayer();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const {
    rowRef: crewRowRef,
    showLeftArrow: showCrewLeft,
    showRightArrow: showCrewRight,
    handleScroll: handleCrewScroll,
  } = useScrollRow(movie?.crew || []);

  const videoId = useMemo(
    () => getYouTubeId(movie?.trailerUrl),
    [movie?.trailerUrl],
  );
  const backgroundEmbedUrl = useMemo(() => {
    if (!videoId) return null;
    return getYouTubeBackgroundEmbedUrl(videoId);
  }, [videoId]);

  useEffect(() => {
    setVideoLoaded(false);
    if (backgroundEmbedUrl) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [backgroundEmbedUrl]);

  useEffect(() => {
    if (userRating) {
      setSelectedStars(userRating.stars);
      setCommentText(userRating.comment || "");
    }
  }, [userRating]);

  const { averageRating, ratingCount } = calculateRatingStats(movie?.ratings);

  const handleAddRating = useCallback(
    (movieId: string, stars: number, comment: string) => {
      addRatingMutation.mutate(
        { movieId, stars, comment: comment.trim() || null },
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
    (movieId: string, stars: number, comment: string) => {
      updateRatingMutation.mutate(
        { movieId, stars, comment: comment.trim() || null },
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
    (movieId: string) => {
      deleteRatingMutation.mutate(
        { movieId },
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
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-brand selection:text-black">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10 animate-fade-in">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl glass-panel">
          <div className="relative h-[420px] md:h-[520px] w-full bg-black/45 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0"
              style={{
                backgroundImage: `url(${movie?.thumbnail})`,
                opacity: videoLoaded ? 0 : 0.8,
                visibility: videoLoaded ? "hidden" : "visible",
              }}
            />

            {backgroundEmbedUrl && (
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <iframe
                  src={backgroundEmbedUrl}
                  title="Trailer Background"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className={`absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[1.35] transition-opacity duration-1000 ${
                    videoLoaded ? "opacity-45" : "opacity-0"
                  }`}
                  style={{ pointerEvents: "none" }}
                  tabIndex={-1}
                />
              </div>
            )}

            <div className="absolute inset-0 bg-transparent pointer-events-auto z-10" />

            <div
              className="absolute inset-0 z-[9] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.3) 65%, rgba(var(--theme-bg-rgb), 0.75) 100%),
                  linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.9) 0%, rgba(var(--theme-bg-rgb), 0.25) 45%, transparent 100%)
                `,
              }}
            />

            <button
              onClick={() => router.back()}
              className="absolute top-6 left-6 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-zinc-700/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 z-20"
              aria-label="ย้อนกลับ"
            >
              <ArrowBackIcon className="text-xl" />
            </button>

            <div className="absolute bottom-6 left-6 md:left-12 flex flex-wrap items-end gap-4 z-20 w-[90%]">
              <div>
                <div className="text-xs font-semibold tracking-widest text-brand mb-2.5 bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md inline-block">
                  GLORY ORIGINAL
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md mb-5 leading-tight">
                  {movie?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="white"
                    size="md"
                    onClick={() => movie && playMovie(movie)}
                  >
                    <PlayArrowIcon className="text-xl mr-1.5" />
                    เล่น
                  </Button>

                  {movie?.trailerUrl && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setIsPlayingTrailer(true)}
                    >
                      <PlayArrowIcon className="text-xl mr-1.5 text-brand" />
                      ตัวอย่างภาพยนตร์
                    </Button>
                  )}

                  <button className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-emerald-400 cursor-pointer transition-colors">
                    <CheckIcon className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-zinc-400">
              <span className="text-zinc-200">{movie?.year}</span>

              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="px-1.5 py-0.5 text-xs font-bold border border-zinc-800 text-zinc-300 rounded bg-zinc-900/50">
                {movie?.ageRating?.name}
              </span>

              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="text-zinc-200">{movie?.duration} นาที</span>

              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
              <span className="px-2.5 py-0.5 text-xs font-bold bg-brand/10 border border-brand/20 text-brand rounded-full">
                {movie?.category &&
                  (CATEGORY_TITLE_MAPPING[movie.category.name] ||
                    movie.category.name)}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-400 tracking-wide uppercase">
                เรื่องย่อ
              </h3>
              <p className="text-zinc-200 text-sm leading-relaxed font-light">
                {movie?.description}
              </p>
            </div>
            {(movie?.hasProfanity || movie?.hasDrugs) && (
              <div className="flex items-center gap-2 text-xs text-red-400/90 pt-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="font-semibold flex-shrink-0">
                  คำเตือนเนื้อหา:
                </span>
                <span className="text-zinc-400 font-normal">
                  {[
                    movie.hasProfanity && "มีคำหยาบคาย",
                    movie.hasDrugs && "มียาเสพติด/สิ่งมึนเมา",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            <div className="space-y-5 pt-6 border-t border-zinc-800/60 group/row relative">
              <h4 className="text-base font-bold text-white tracking-wide uppercase pl-1">
                ทีมงานและนักแสดง
              </h4>

              <div className="relative">
                {showCrewLeft && (
                  <button
                    onClick={() => handleCrewScroll("left")}
                    className="absolute left-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-r-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-r border-zinc-800/20 cursor-pointer shadow-lg"
                  >
                    <ChevronLeftIcon className="text-3xl hover:scale-125 transition-transform" />
                  </button>
                )}

                <div
                  ref={crewRowRef}
                  className="flex gap-4 overflow-x-auto pb-3.5 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                  {movie?.crew && movie.crew.length > 0 ? (
                    movie.crew.map((member) => (
                      <Link
                        href={`/crew/${member.crewMember?.id}`}
                        key={member.id}
                        className="flex items-center gap-3.5 glass-card p-3 rounded-2xl group flex-shrink-0 w-60 snap-start cursor-pointer block"
                      >
                        {member.crewMember?.user?.photoUrl ? (
                          <img
                            src={member.crewMember.user.photoUrl}
                            alt={member.crewMember.name}
                            className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-zinc-700/50 group-hover:border-brand/40 transition-colors flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                            <PersonIcon className="text-xl" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-200 group-hover:text-brand transition-colors flex items-center gap-1.5 truncate">
                            {member.crewMember?.name}
                            {member.crewMember?.userId && (
                              <span
                                className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"
                                title="ผู้ใช้งานระบบ"
                              />
                            )}
                          </p>
                          <p className="text-[10px] text-brand uppercase tracking-widest font-medium mt-0.5 truncate">
                            {member.role}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-550 italic font-light">
                      ไม่มีข้อมูลทีมงานและนักแสดงสำหรับเรื่องนี้
                    </p>
                  )}
                </div>

                {showCrewRight && (
                  <button
                    onClick={() => handleCrewScroll("right")}
                    className="absolute right-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-l-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-l border-zinc-800/20 cursor-pointer shadow-lg"
                  >
                    <ChevronRightIcon className="text-3xl hover:scale-125 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {movie?.btsVideos && movie.btsVideos.filter(Boolean).length > 0 && (
              <div className="space-y-5 pt-6 border-t border-zinc-800/60">
                <h4 className="text-base font-bold text-white tracking-wide uppercase">
                  วิดีโอเบื้องหลังการถ่ายทำ
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {movie.btsVideos.filter(Boolean).map((videoUrl, idx) => {
                    const ytid = getYouTubeId(videoUrl);
                    if (!ytid) return null;

                    return (
                      <div key={idx} className="space-y-2.5">
                        <p className="font-bold text-sm text-zinc-350">
                          วิดีโอเบื้องหลัง #{idx + 1}
                        </p>
                        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full shadow-lg shadow-black/50 transition-all hover:border-brand/30">
                          <iframe
                            src={`https://www.youtube.com/embed/${ytid}`}
                            title={`YouTube BTS Video Preview ${idx + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-zinc-800/60">
              <h4 className="text-lg font-bold text-white tracking-wide">
                รีวิวจากผู้ชม ({movie?.ratings?.length || 0})
              </h4>

              <div className="space-y-3.5 max-w-2xl">
                {movie?.ratings && movie.ratings.length > 0 ? (
                  movie.ratings.slice(0, 5).map((rating) => (
                    <div
                      key={`${rating.userId}-${rating.movieId}`}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex items-start gap-4"
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
            <div className="p-6 rounded-2xl glass-panel-gold space-y-6 shadow-xl animate-fade-in">
              <div className="text-center space-y-3">
                <span className="text-zinc-450 text-[10px] uppercase tracking-widest font-semibold block">
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

              <div className="border-t border-zinc-800/40 pt-5 space-y-4">
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

                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isRatingPending}
                  placeholder="เขียนความคิดเห็นของคุณเกี่ยวกับหนังเรื่องนี้... (ไม่บังคับ)"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors resize-none"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (!currentUser || !movie) {
                        showToast("กรุณาเข้าสู่ระบบก่อนโหวตคะแนน", "warning");
                        return;
                      }
                      if (userRating) {
                        handleUpdateRating(
                          movie.id,
                          selectedStars,
                          commentText,
                        );
                      } else {
                        handleAddRating(movie.id, selectedStars, commentText);
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
                          handleDeleteRating(movie.id);
                          setSelectedStars(5);
                          setCommentText("");
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

            <div className="p-6 rounded-2xl glass-panel space-y-4 shadow-xl text-xs">
              <h5 className="text-xs font-bold text-white uppercase tracking-widest text-left border-b border-zinc-800/60 pb-3 flex items-center justify-between">
                <span>ข้อมูลภาพยนตร์</span>
                <span className="w-1.5 h-1.5 bg-brand rounded-full" />
              </h5>
              <div className="space-y-3.5">
                {movie?.university && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      มหาวิทยาลัย / สถาบัน
                    </span>
                    <span className="text-zinc-200 font-medium text-right max-w-40">
                      {movie.university.name}
                    </span>
                  </div>
                )}
                {movie?.studio && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-zinc-900/40">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      ค่าย / สังกัด
                    </span>
                    <span className="text-zinc-200 font-medium text-right">
                      {movie.studio}
                    </span>
                  </div>
                )}
                {movie?.targetGroup && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-zinc-900/40">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      กลุ่มเป้าหมาย
                    </span>
                    <span className="text-zinc-200 font-medium text-right">
                      {movie.targetGroup.name}
                    </span>
                  </div>
                )}
                {movie?.language && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-zinc-900/40">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      ภาษา
                    </span>
                    <span className="text-zinc-200 font-medium text-right">
                      {movie.language.name}
                    </span>
                  </div>
                )}
                {movie?.aspectRatio && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-zinc-900/40">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      อัตราส่วนภาพ
                    </span>
                    <span className="text-zinc-200 font-medium text-right">
                      {movie.aspectRatio}
                    </span>
                  </div>
                )}
                {movie?.colorType && (
                  <div className="flex justify-between items-start gap-4 pt-3 border-t border-zinc-900/40">
                    <span className="text-zinc-550 font-light whitespace-nowrap">
                      โทนสี
                    </span>
                    <span className="text-zinc-200 font-medium text-right">
                      {movie.colorType === "color" ? "ภาพสี" : "ขาวดำ"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPlayingTrailer && movie && movie.trailerUrl && (
        <PlayerModal
          isOpen={isPlayingTrailer}
          onClose={() => setIsPlayingTrailer(false)}
          youtubeUrl={movie.trailerUrl}
          movieTitle={`${movie.title} (ตัวอย่างภาพยนตร์)`}
        />
      )}
    </div>
  );
}
