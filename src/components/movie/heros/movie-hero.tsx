"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Movie } from "@/core/domain/movie";
import { Button } from "@/components/ui/button";
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

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const startTimer = useCallback(() => {
    if (heroMovies.length <= 1) return;
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 4000);
  }, [heroMovies.length, stopTimer]);

  useEffect(() => {
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isHovered, startTimer, stopTimer]);

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
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.9) 0%, rgba(var(--theme-bg-rgb), 0.35) 45%, transparent 100%),
              url(${movie.thumbnail})
            `,
            opacity: index === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div
        className="absolute inset-x-0 bottom-0 h-[260px] md:h-[360px] pointer-events-none z-5"
        style={{
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      >
        {heroMovies.map((movie, index) => (
          <div
            key={`ambient-${movie.id}`}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out blur-[70px] md:blur-[110px] scale-130"
            style={{
              backgroundImage: `url(${movie.thumbnail})`,
              opacity: index === activeIndex ? 0.8 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="absolute inset-0 bg-black/5 pointer-events-none z-0" />

      <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePrev}
          aria-label="ภาพยนตร์ก่อนหน้า"
          className="p-2 rounded-full bg-black/40 text-white hover:bg-black/75 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeftIcon className="text-2xl md:text-3xl" />
        </button>
      </div>

      <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleNext}
          aria-label="ภาพยนตร์ถัดไป"
          className="p-2 rounded-full bg-black/40 text-white hover:bg-black/75 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronRightIcon className="text-2xl md:text-3xl" />
        </button>
      </div>

      <div className="max-w-4xl relative z-10 space-y-4 md:space-y-6 pt-16 md:pt-20 transition-all duration-500 transform translate-y-0">
        <Link
          href={`/movies/${currentMovie.id}`}
          className="inline-block group/title"
        >
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight select-none drop-shadow-2xl animate-fade-in group-hover/title:text-brand transition-colors cursor-pointer"
            key={`title-${currentMovie.id}`}
          >
            {currentMovie.title}
          </h1>
        </Link>

        <div
          className="flex items-center gap-3 text-xs md:text-sm animate-fade-in"
          key={`meta-${currentMovie.id}`}
        >
          <span className="text-zinc-300">
            {currentMovie.releaseDate
              ? new Date(currentMovie.releaseDate).getFullYear()
              : ""}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] md:text-xs font-bold border border-zinc-700 text-zinc-300 rounded-sm leading-none bg-zinc-900/40">
            {currentMovie.ageRating}
          </span>
          {currentMovie.categories && currentMovie.categories.map((cat) => (
            <span
              key={cat.id}
              className="px-2.5 py-0.5 text-[10px] md:text-xs font-medium bg-white/10 border border-white/20 text-zinc-200 rounded-full whitespace-nowrap"
            >
              {cat.labelTh || cat.name}
            </span>
          ))}
        </div>

        <p
          className="text-zinc-200 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed font-light drop-shadow-md select-none animate-fade-in"
          key={`desc-${currentMovie.id}`}
        >
          {currentMovie.description}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="brand"
            onClick={() => onPlayClick(currentMovie)}
            className="px-3 md:px-5 py-2.5 md:py-2 flex items-center gap-2 text-zinc-950 font-extrabold"
          >
            <PlayArrowIcon />
          </Button>

          <Button
            variant="outline"
            onClick={() => onToggleFavorite(currentMovie.id)}
            className={`px-3 md:px-5 py-2.5 md:py-2 flex items-center gap-2 border transition-all ${
              favorites.some((fav) => fav.id === currentMovie.id)
                ? "bg-brand/10 border-brand/50 text-brand hover:border-brand/70"
                : "bg-zinc-900/40 border-zinc-700/60 text-white hover:border-brand/40"
            }`}
          >
            {favorites.some((fav) => fav.id === currentMovie.id) ? (
              <CheckIcon />
            ) : (
              <AddIcon />
            )}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            aria-label={`ไปยังภาพยนตร์ที่ ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 cursor-pointer ${
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
