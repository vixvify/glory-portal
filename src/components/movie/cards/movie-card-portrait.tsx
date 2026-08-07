"use client";

import { memo } from "react";
import Image from "next/image";
import { Movie } from "@/core/domain/movie";

interface Props {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
}

function MovieCardPortrait({ movie }: Props) {
  return (
    <div className="group relative cursor-pointer glass-border rounded-3xl overflow-hidden z-10 hover:z-20 flex flex-col h-full bg-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.85)] transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 mix-blend-overlay" />

      <div className="relative w-full overflow-hidden bg-zinc-950 transition-all duration-300 aspect-[2/3]">
        <Image
          src={movie.thumbnail}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />


      </div>
    </div>
  );
}

export default memo(MovieCardPortrait);
