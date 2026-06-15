"use client";

import { memo } from "react";
import Image from "next/image";
import { Movie } from "@/core/domain/movie";

interface Props {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: string) => void;
}

function MovieCardPortrait({ movie }: Props) {
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

        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-16px)]">
          {movie.categories && movie.categories.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-black/60 backdrop-blur-md text-zinc-300 border border-zinc-700/50 rounded uppercase whitespace-nowrap"
            >
              {cat.labelTh || cat.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCardPortrait);
