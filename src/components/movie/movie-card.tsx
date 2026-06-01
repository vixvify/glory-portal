"use client";

import { memo } from "react";
import Image from "next/image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { Movie } from "../../core/domain/movie";
import { useAppStore } from "@/store/use-store";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { calculateRatingStats } from "@/utils/rating";

interface Props {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
}

function MovieCard({
  movie,
  onPlayClick,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const { averageRating } = calculateRatingStats(movie.ratings);
  const { currentUser } = useAppStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayClick(movie);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  return (
    <div className="group relative cursor-pointer bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 md:hover:scale-112 hover:shadow-2xl hover:shadow-black/50 hover:border-zinc-700/60 z-10 hover:z-20 flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <Image
          src={movie.thumbnail}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <PlayArrowIcon className="text-2xl ml-0.5" />
          </div>
        </div>

        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/50 rounded uppercase">
          {CATEGORY_TITLE_MAPPING[movie.category]}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-[#181818]">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm md:text-base text-white tracking-wide leading-tight group-hover:text-red-500 transition-colors duration-300 line-clamp-1">
              {movie.title}
            </h3>
            <span className="text-[10px] text-zinc-400 shrink-0 font-medium">
              {movie.year}
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-2 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-emerald-400 font-bold shrink-0">
              {movie.matchRate}%
            </span>
            <span className="px-1 py-0.2 border border-zinc-600 text-[9px] text-zinc-300 rounded leading-none scale-90">
              {movie.ageRating}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <StarIcon className="text-xs md:text-[14px]" />
              <span className="text-zinc-200 text-[10px] md:text-xs">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlay}
              className="p-1 rounded-full bg-zinc-800 text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all shadow cursor-pointer border border-zinc-700/50"
              title="ตัวอย่างภาพยนตร์"
            >
              <PlayArrowIcon className="text-base" />
            </button>
            {currentUser && (
              <button
                onClick={handleToggle}
                className={`p-1 rounded-full border transition-all cursor-pointer ${
                  isFavorite
                    ? "bg-zinc-800 border-zinc-500 text-green-400 hover:border-white"
                    : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
                title={isFavorite ? "ลบจากรายการของฉัน" : "เพิ่มในรายการของฉัน"}
              >
                {isFavorite ? (
                  <CheckIcon className="text-base" />
                ) : (
                  <AddIcon className="text-base" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);
