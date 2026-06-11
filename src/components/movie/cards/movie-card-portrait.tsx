"use client";

import { memo } from "react";
import Image from "next/image";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Movie } from "@/core/domain/movie";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";

interface Props {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
}

function MovieCardPortrait({
  movie,
  onPlayClick,
}: Props) {
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlayClick(movie);
  };

  return (
    <div className="group relative cursor-pointer glass-card rounded-lg overflow-hidden z-10 hover:z-20 flex flex-col h-full border border-white/5 transition-all duration-300">
      <div className="relative w-full overflow-hidden bg-zinc-950 transition-all duration-300 aspect-[2/3]">
        <Image
          src={movie.thumbnail}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div 
          onClick={handlePlay}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-brand text-black flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <PlayArrowIcon className="text-2xl ml-0.5" />
          </div>
        </div>

        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/50 rounded uppercase">
          {movie.category ? (CATEGORY_TITLE_MAPPING[movie.category.name] || movie.category.name) : ""}
        </span>
      </div>
    </div>
  );
}

export default memo(MovieCardPortrait);
