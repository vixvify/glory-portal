"use client";

import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Button } from "@/components/ui/button";
import { Rating } from "@/core/domain/rating";
import { calculateRatingStats } from "@/utils/rating";

interface Props {
  movieId: string;
  ratings: Rating[];
  userRating: Rating | null | undefined;
  isLoggedIn: boolean;
  isPending: boolean;
  onAdd: (movieId: string, stars: number, comment: string) => void;
  onUpdate: (movieId: string, stars: number, comment: string) => void;
  onDelete: (movieId: string) => void;
  onAuthRequired: () => void;
}

export default function MovieRatingPanel({
  movieId,
  ratings,
  userRating,
  isLoggedIn,
  isPending,
  onAdd,
  onUpdate,
  onDelete,
  onAuthRequired,
}: Props) {
  const [draftStars, setDraftStars] = useState<number | null>(null);
  const [draftComment, setDraftComment] = useState<string | null>(null);

  const { averageRating, ratingCount } = calculateRatingStats(ratings);

  const selectedStars = draftStars ?? userRating?.stars ?? 0;
  const commentText = draftComment ?? userRating?.comment ?? "";

  const handleSubmit = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    if (userRating) {
      onUpdate(movieId, selectedStars, commentText);
    } else {
      onAdd(movieId, selectedStars, commentText);
    }
  };

  const handleDelete = () => {
    if (isLoggedIn) {
      onDelete(movieId);
      setDraftStars(5);
      setDraftComment("");
    }
  };

  return (
    <div className="p-6 rounded-lg glass-panel-gold space-y-6 shadow-xl animate-fade-in">
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
              <StarBorderIcon key={idx} className="text-zinc-750 text-2xl" />
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
                onClick={() => setDraftStars(starValue)}
                disabled={isPending}
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
            onClick={handleSubmit}
            variant="brand"
            size="md"
            className="flex-1"
            isLoading={isPending}
            disabled={isPending}
          >
            {userRating ? "แก้ไขคะแนน" : "ส่งคะแนน"}
          </Button>

          {userRating && (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 bg-red-950/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-red-900/30 text-sm font-bold rounded-md cursor-pointer transition-colors active:scale-95 flex items-center justify-center py-2.5 disabled:opacity-50 disabled:pointer-events-none"
              title="ลบคะแนน"
            >
              ลบ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
