"use client";

import { useEffect, useState, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Movie } from "@/core/domain/movie";
import { User } from "@/core/domain/user";
import { Rating } from "@/core/domain/rating";
import { Button } from "@/components/ui/button";
import { calculateRatingStats } from "@/utils/rating";

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
  onPlayTrailer: () => void;
  onAddRating: (movieId: string, user: User, score: number) => void;
  onUpdateRating?: (movieId: string, user: User, score: number) => void;
  onDeleteRating?: (movieId: string, user: User) => void;
  userRating: Rating | null;
  currentUser: User | null;
  onSignInClick: () => void;
}

export default function MovieDetailsModal({
  isOpen,
  onClose,
  movie,
  isFavorite,
  onToggleFavorite,
  onPlayTrailer,
  onAddRating,
  onUpdateRating,
  onDeleteRating,
  userRating,
  currentUser,
  onSignInClick,
}: MovieDetailsModalProps) {
  const [reviewScore, setReviewScore] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (userRating) {
        setIsSubmitted(true);
        setReviewScore(userRating.stars);
      } else {
        setIsSubmitted(false);
        setReviewScore(5);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, userRating]);

  if (!isOpen) return null;

  const { averageRating } = calculateRatingStats(movie.ratings);

  const directors = useMemo(
    () =>
      movie.crew
        ?.filter((c) => c.role.toLowerCase() === "director")
        .map((c) => c.crewMember)
        .filter((x): x is NonNullable<typeof x> => !!x) || [],
    [movie.crew],
  );
  const producers = useMemo(
    () =>
      movie.crew
        ?.filter((c) => c.role.toLowerCase() === "producer")
        .map((c) => c.crewMember)
        .filter((x): x is NonNullable<typeof x> => !!x) || [],
    [movie.crew],
  );
  const writers = useMemo(
    () =>
      movie.crew
        ?.filter((c) => c.role.toLowerCase() === "writer")
        .map((c) => c.crewMember)
        .filter((x): x is NonNullable<typeof x> => !!x) || [],
    [movie.crew],
  );
  const cast = useMemo(
    () =>
      movie.crew
        ?.filter((c) => c.role.toLowerCase() === "cast")
        .map((c) => c.crewMember)
        .filter((x): x is NonNullable<typeof x> => !!x) || [],
    [movie.crew],
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (userRating) {
      onUpdateRating?.(movie.id, currentUser, reviewScore);
    } else {
      onAddRating(movie.id, currentUser, reviewScore);
    }
    setIsSubmitted(true);
  };

  const handleDeleteReview = () => {
    if (!currentUser) return;
    onDeleteRating?.(movie.id, currentUser);
    setIsSubmitted(false);
    setReviewScore(5);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-card rounded-2xl overflow-y-auto max-h-[90vh] shadow-2xl border border-zinc-800/80 animate-scale-up z-10 no-scrollbar">
        <div
          className="relative h-64 md:h-96 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, var(--theme-bg), rgba(var(--theme-bg-rgb), 0.4) 40%, rgba(var(--theme-bg-rgb), 0.7)), url(${movie.thumbnail})`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-zinc-700/50"
          >
            <CloseIcon className="text-xl" />
          </button>

          <div className="absolute bottom-6 left-6 md:left-12 flex flex-wrap items-end gap-4 z-10 w-[90%]">
            <div>
              <div className="text-sm font-semibold tracking-wider text-brand mb-1">
                GLORY ORIGINAL
              </div>
              <h2 className="text-2xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md mb-4">
                {movie.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="white"
                  onClick={onPlayTrailer}
                  className="text-sm px-6 py-2.5 flex items-center gap-2 shadow-lg"
                >
                  <PlayArrowIcon className="text-xl" />
                  เล่นตัวอย่าง
                </Button>

                <button
                  onClick={() => onToggleFavorite(movie.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer ${
                    isFavorite
                      ? "bg-zinc-800 border-zinc-400 text-emerald-400 hover:border-white"
                      : "bg-[#181818]/60 border-zinc-500 text-white hover:border-white hover:bg-zinc-800"
                  }`}
                  title={
                    isFavorite ? "ลบจากรายการของฉัน" : "เพิ่มในรายการของฉัน"
                  }
                >
                  {isFavorite ? (
                    <CheckIcon className="text-lg" />
                  ) : (
                    <AddIcon className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-emerald-400 font-bold tracking-tight">
                {movie.matchRate}% ตรงกับคุณ
              </span>
              <span className="text-zinc-400">{movie.year}</span>
              <span className="px-1.5 py-0.5 text-xs font-semibold border border-zinc-500 text-zinc-300 rounded">
                {movie.ageRating}
              </span>
              <span className="text-zinc-400">{movie.duration} นาที</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-zinc-850 text-zinc-300 rounded-full">
                {movie.category}
              </span>
              {movie.university && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-brand/10 text-brand border border-brand/20 rounded-full">
                  {movie.university}
                </span>
              )}
            </div>

            <p className="text-zinc-200 text-base md:text-lg leading-relaxed font-light">
              {movie.description}
            </p>

            <div className="space-y-4 pt-6 border-t border-zinc-800/60">
              <h4 className="text-lg font-bold text-white tracking-wide">
                รีวิวจากผู้ชม ({movie.ratings.length})
              </h4>

              <div className="space-y-3.5 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {movie.ratings.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic">
                    ยังไม่มีรีวิวจากผู้ชม
                  </p>
                ) : (
                  movie.ratings.map((rating, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3.5"
                    >
                      <AccountCircleIcon className="text-zinc-650 text-3xl mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-zinc-200 truncate flex items-center gap-1.5">
                            {rating.user.name}
                            {currentUser &&
                              rating.userId === currentUser.id && (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  คุณ
                                </span>
                              )}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < rating.stars ? (
                                  <StarIcon className="text-sm" />
                                ) : (
                                  <StarBorderIcon className="text-sm text-zinc-700" />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 font-light italic">
                          "ให้คะแนนเรื่องนี้ {rating.stars} ดาว"
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {(directors.length > 0 ||
              producers.length > 0 ||
              writers.length > 0 ||
              cast.length > 0) && (
              <div className="space-y-6 pt-6 border-t border-zinc-800/60">
                <h4 className="text-base font-bold text-white tracking-wide uppercase">
                  ทีมงานและนักแสดง (Cast & Crew)
                </h4>
                <div className="space-y-5">
                  {directors.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-zinc-400 text-xs uppercase tracking-wider block font-semibold border-l-2 border-brand pl-2">
                        ผู้กำกับ / Directors ({directors.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {directors.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-850/60 border border-zinc-800/85 p-2.5 rounded-xl transition-all duration-300 group"
                          >
                            {d.photoUrl ? (
                              <img
                                src={d.photoUrl}
                                alt={d.name}
                                className="w-12 h-12 rounded-full object-cover border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors shadow-inner"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors">
                                <AccountCircleIcon className="text-[32px] text-zinc-550" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-zinc-100 text-[12px] sm:text-[13px] truncate group-hover:text-white transition-colors">
                                {d.name}
                              </p>
                              <p className="text-[10px] text-zinc-550 font-medium truncate mt-0.5">
                                ผู้กำกับ / Director
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {producers.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-zinc-400 text-xs uppercase tracking-wider block font-semibold border-l-2 border-brand pl-2">
                        ผู้อำนวยการสร้าง / Producers ({producers.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {producers.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-850/60 border border-zinc-800/85 p-2.5 rounded-xl transition-all duration-300 group"
                          >
                            {p.photoUrl ? (
                              <img
                                src={p.photoUrl}
                                alt={p.name}
                                className="w-12 h-12 rounded-full object-cover border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors shadow-inner"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors">
                                <AccountCircleIcon className="text-[32px] text-zinc-550" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-zinc-100 text-[12px] sm:text-[13px] truncate group-hover:text-white transition-colors">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-zinc-550 font-medium truncate mt-0.5">
                                ผู้อำนวยการสร้าง / Producer
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {writers.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-zinc-400 text-xs uppercase tracking-wider block font-semibold border-l-2 border-brand pl-2">
                        ผู้เขียนบท / Writers ({writers.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {writers.map((w) => (
                          <div
                            key={w.id}
                            className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-850/60 border border-zinc-800/85 p-2.5 rounded-xl transition-all duration-300 group"
                          >
                            {w.photoUrl ? (
                              <img
                                src={w.photoUrl}
                                alt={w.name}
                                className="w-12 h-12 rounded-full object-cover border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors shadow-inner"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors">
                                <AccountCircleIcon className="text-[32px] text-zinc-550" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-zinc-100 text-[12px] sm:text-[13px] truncate group-hover:text-white transition-colors">
                                {w.name}
                              </p>
                              <p className="text-[10px] text-zinc-550 font-medium truncate mt-0.5">
                                ผู้เขียนบท / Writer
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cast.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-zinc-400 text-xs uppercase tracking-wider block font-semibold border-l-2 border-brand pl-2">
                        นักแสดง / Cast ({cast.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cast.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 bg-zinc-900/40 hover:bg-zinc-850/60 border border-zinc-800/85 p-2.5 rounded-xl transition-all duration-300 group"
                          >
                            {c.photoUrl ? (
                              <img
                                src={c.photoUrl}
                                alt={c.name}
                                className="w-12 h-12 rounded-full object-cover border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors shadow-inner"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/80 group-hover:border-brand/60 flex-shrink-0 transition-colors">
                                <AccountCircleIcon className="text-[32px] text-zinc-550" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-zinc-100 text-[12px] sm:text-[13px] truncate group-hover:text-white transition-colors">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-zinc-550 font-medium truncate mt-0.5">
                                นักแสดง / Actor
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {movie.bts &&
              ((movie.bts.btsVideo && movie.bts.btsVideo.length > 0) ||
                (movie.bts.btsPhotos && movie.bts.btsPhotos.length > 0)) && (
                <div className="space-y-4 pt-6 border-t border-zinc-800/60">
                  <h4 className="text-base font-bold text-white tracking-wide uppercase">
                    เบื้องหลังการถ่ายทำ (Behind the Scenes)
                  </h4>
                  <div className="space-y-4">
                    {movie.bts.btsVideo &&
                      movie.bts.btsVideo.map((videoUrl, index) => (
                        <div
                          key={`bts-video-${index}`}
                          className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950"
                        >
                          <iframe
                            src={videoUrl.replace("watch?v=", "embed/")}
                            title={`Behind The Scenes Video ${index + 1}`}
                            className="w-full h-full absolute inset-0 border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ))}
                    {movie.bts.btsPhotos && movie.bts.btsPhotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {movie.bts.btsPhotos.map((photo, index) => (
                          <div
                            key={`bts-photo-${index}`}
                            className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800/80 group/bts shadow-lg bg-zinc-950"
                          >
                            <img
                              src={photo}
                              alt={`Behind the Scenes Photo ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/bts:scale-108"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-850 text-center space-y-2 shadow-xl shadow-black/10">
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
                คะแนนเฉลี่ย
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-zinc-500">/ 5.0</span>
              </div>
              <div className="flex justify-center text-amber-555">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < Math.round(averageRating) ? (
                      <StarIcon className="text-lg text-amber-500" />
                    ) : (
                      <StarBorderIcon className="text-lg text-zinc-700" />
                    )}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-500 font-light">
                จากการรีวิว {movie.ratings.length} รายการ
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 shadow-xl">
              <h5 className="text-sm font-bold text-white tracking-wide uppercase">
                ให้คะแนนหนังนี้
              </h5>

              {isSubmitted ? (
                <div className="text-center py-4 space-y-3 animate-fade-in">
                  <span className="text-emerald-400 font-semibold text-sm block">
                    คุณบันทึกคะแนนแล้ว!
                  </span>
                  <div className="flex justify-center text-amber-555 my-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < reviewScore ? (
                          <StarIcon className="text-xl animate-scale-up text-amber-500" />
                        ) : (
                          <StarBorderIcon className="text-xl text-zinc-700" />
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 font-light">
                    คุณให้คะแนน {reviewScore} จาก 5 ดาว
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2 pt-1 border-t border-zinc-800/50">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-brand font-medium hover:underline cursor-pointer transition-all hover:scale-105"
                    >
                      แก้ไขคะแนน
                    </button>
                    <span className="text-zinc-700 text-xs">•</span>
                    <button
                      type="button"
                      onClick={handleDeleteReview}
                      className="text-xs text-rose-500 font-medium hover:underline cursor-pointer transition-all hover:scale-105"
                    >
                      ลบคะแนน
                    </button>
                  </div>
                </div>
              ) : currentUser ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-400 font-medium">
                      รีวิวจากผู้ใช้:
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[120px] bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                      {currentUser.name || currentUser.email}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 font-medium block">
                      คะแนน
                    </label>
                    <div className="flex items-center justify-between px-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const scoreValue = i + 1;
                        return (
                          <button
                            type="button"
                            key={scoreValue}
                            onClick={() => setReviewScore(scoreValue)}
                            className="p-1 text-amber-500 transition-transform duration-200 hover:scale-125 focus:outline-none cursor-pointer"
                          >
                            {scoreValue <= reviewScore ? (
                              <StarIcon className="text-2xl animate-scale-up" />
                            ) : (
                              <StarBorderIcon className="text-2xl text-zinc-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    ส่งคะแนน
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    คุณต้องเข้าสู่ระบบเพื่อให้คะแนนและแสดงความคิดเห็น
                  </p>
                  <Button
                    variant="secondary"
                    onClick={onSignInClick}
                    className="w-full py-2.5 text-xs flex items-center justify-center gap-2"
                  >
                    <LockOpenIcon className="text-sm text-brand" />
                    เข้าสู่ระบบเพื่อให้คะแนน
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
