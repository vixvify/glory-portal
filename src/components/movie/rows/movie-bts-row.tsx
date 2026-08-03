"use client";

import { useState } from "react";
import Image from "next/image";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useScrollRow } from "@/hooks/system/use-scroll-row";
import { Movie } from "@/core/domain/movie";

export interface BtsVideoItem {
  id: string;
  movie: Movie;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
}

interface MovieBtsRowProps {
  title: string;
  btsVideos: BtsVideoItem[];
  onPlayClick: (videoUrl: string) => void;
}

export default function MovieBtsRow({
  title,
  btsVideos,
  onPlayClick,
}: MovieBtsRowProps) {
  const { rowRef, showLeftArrow, showRightArrow, handleScroll } = useScrollRow(btsVideos);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!btsVideos || btsVideos.length === 0) return null;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-3 group/row relative">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100 tracking-wide hover:text-white cursor-pointer transition-colors duration-200 inline-block">
        {title}
      </h3>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-r-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-r border-zinc-800/20 cursor-pointer shadow-lg"
          >
            <ChevronLeftIcon className="text-3xl hover:scale-125 transition-transform" />
          </button>
        )}
        
        <div
          ref={rowRef as React.RefObject<HTMLDivElement>}
          className="flex overflow-x-auto gap-4 py-4 px-1.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {btsVideos.map((item) => {
            const hasError = imageErrors[item.id];
            
            return (
              <div
                key={item.id}
                className="flex-none snap-start group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-zinc-900 w-[280px] sm:w-[340px] md:w-[400px] aspect-video glass-border shadow-[0_10px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.85)]"
                onClick={() => onPlayClick(item.videoUrl)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 mix-blend-overlay" />
                {!hasError ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.naturalWidth === 120 && img.naturalHeight === 90) {
                        handleImageError(item.id);
                      }
                    }}
                    onError={() => handleImageError(item.id)}
                    unoptimized
                  />
                ) : item.movie?.thumbnail ? (
                  <Image
                    src={item.movie.thumbnail as string}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <span className="text-zinc-500 font-medium">ไม่มีรูปภาพประกอบ</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                

              </div>
            );
          })}
        </div>
        
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-l-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-l border-zinc-800/20 cursor-pointer shadow-lg"
          >
            <ChevronRightIcon className="text-3xl hover:scale-125 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
