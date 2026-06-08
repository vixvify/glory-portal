"use client";

import { useEffect, useState, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Movie } from "@/core/domain/movie";
import { Button } from "@/components/ui/button";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import Link from "next/link";

interface Props {
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
}

export default function MovieHero({
  movies,
  onPlayClick,
  favorites = [],
  onToggleFavorite,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const heroMovies = movies.slice(0, 4);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 4000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isHovered, heroMovies.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(
      (prev) => (prev - 1 + heroMovies.length) % heroMovies.length,
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % heroMovies.length);
  };

  if (!heroMovies.length) return null;

  const currentMovie = heroMovies[activeIndex];

  return (
    <section
      className="relative h-[75vh] md:h-[88vh] w-full flex items-center px-6 md:px-16 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {heroMovies.map((movie, index) => (
        <div
          key={movie.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.4) 60%, rgba(var(--theme-bg-rgb), 0.85) 100%),
              linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.95) 0%, rgba(var(--theme-bg-rgb), 0.3) 40%, transparent 100%),
              url(${movie.thumbnail})
            `,
            opacity: index === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/40 text-white hover:bg-black/75 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeftIcon className="text-2xl md:text-3xl" />
        </button>
      </div>

      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-black/40 text-white hover:bg-black/75 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronRightIcon className="text-2xl md:text-3xl" />
        </button>
      </div>

      <div className="max-w-4xl relative z-10 space-y-4 md:space-y-6 pt-16 md:pt-20 transition-all duration-500 transform translate-y-0">
        <div
          className="flex items-center gap-2 animate-fade-in"
          key={`badge-${currentMovie.id}`}
        >
          <span className="bg-brand text-white text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded tracking-widest leading-none shadow-md">
            ภาพยนตร์
          </span>
          <span className="text-zinc-300 text-xs md:text-sm font-semibold tracking-widest uppercase">
            ยอดนิยม
          </span>
        </div>

        <Link
          href={`/movies/${currentMovie.id}`}
          className="inline-block group/title"
        >
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wide leading-tight select-none drop-shadow-xl font-sans animate-fade-in group-hover/title:text-brand transition-colors cursor-pointer"
            key={`title-${currentMovie.id}`}
          >
            {currentMovie.title}
          </h1>
        </Link>

        <div
          className="flex items-center gap-3 text-xs md:text-sm animate-fade-in"
          key={`meta-${currentMovie.id}`}
        >
          <span className="text-zinc-300">{currentMovie.year}</span>
          <span className="px-1.5 py-0.5 text-[10px] md:text-xs font-bold border border-zinc-500 text-zinc-300 rounded leading-none">
            {currentMovie.ageRating?.name}
          </span>
          <span className="text-zinc-300">{currentMovie.duration} นาที</span>
          <span className="text-zinc-300 font-semibold bg-zinc-800/80 px-2 py-0.5 rounded-full text-xs">
            {currentMovie.category
              ? CATEGORY_TITLE_MAPPING[currentMovie.category.name] ||
                currentMovie.category.name
              : ""}
          </span>
        </div>

        <p
          className="text-zinc-200 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed font-light drop-shadow-md select-none animate-fade-in"
          key={`desc-${currentMovie.id}`}
        >
          {currentMovie.description}
        </p>

        <div className="flex items-center gap-3.5 pt-2">
          <Button
            variant="white"
            onClick={() => onPlayClick(currentMovie)}
            className="px-6 md:px-8 py-2.5 md:py-3.5 flex items-center gap-2"
          >
            <PlayArrowIcon className="text-xl md:text-2xl" />
            เล่น
          </Button>

          <Button
            variant="outline"
            onClick={() => onToggleFavorite(currentMovie.id)}
            className={`backdrop-blur-md hover:bg-zinc-600/45 active:scale-95 font-bold px-6 md:px-8 py-2.5 md:py-3.5 flex items-center gap-2 border transition-all ${
              favorites.some((fav) => fav.id === currentMovie.id)
                ? "bg-brand/25 border-brand/50 text-brand hover:border-brand/70"
                : "bg-zinc-600/20 border-zinc-500/25 text-white hover:text-white"
            }`}
          >
            {favorites.some((fav) => fav.id === currentMovie.id) ? (
              <CheckIcon className="text-xl md:text-2xl" />
            ) : (
              <AddIcon className="text-xl md:text-2xl" />
            )}
            {favorites.some((fav) => fav.id === currentMovie.id)
              ? "อยู่ในรายการของฉันแล้ว"
              : "เพิ่มในรายการของฉัน"}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:right-16 z-20 flex gap-2">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex
                ? "bg-brand scale-125 w-6"
                : "bg-zinc-600/80 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
