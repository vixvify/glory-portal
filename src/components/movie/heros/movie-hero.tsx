"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Movie } from "@/core/domain/movie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { mapContentWarnings } from "@/core/constants/movie-messages";

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



  if (!heroMovies.length) return null;

  const currentMovie = heroMovies[activeIndex];
  
  const nextMovies = [
    heroMovies[(activeIndex) % heroMovies.length],
    heroMovies[(activeIndex + 1) % heroMovies.length],
    heroMovies[(activeIndex + 2) % heroMovies.length],
  ];

  return (
    <section
      className="relative h-[85vh] md:h-[95vh] w-full flex items-end pb-28 md:pb-36 px-6 md:px-16 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {heroMovies.map((movie, index) => (
        <div
          key={movie.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out pointer-events-none z-0"
          style={{
            backgroundImage: `url(${movie.thumbnail})`,
            opacity: index === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-8 transition-all duration-500 transform translate-y-0">
        
        <div className="max-w-4xl space-y-4 md:space-y-6">
          <Link
            href={`/movies/${currentMovie.id}`}
            className="inline-block group/title"
          >
            <h1
              className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-none drop-shadow-2xl animate-fade-in uppercase"
              key={`title-${currentMovie.id}`}
            >
              {currentMovie.title}
            </h1>
          </Link>

          <div
            className="flex flex-col gap-1.5 animate-fade-in"
            key={`meta-${currentMovie.id}`}
          >
            <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-bold text-white drop-shadow-md tracking-wide">
              <span>
                {currentMovie.releaseDate
                  ? new Date(currentMovie.releaseDate).getFullYear()
                  : ""}
              </span>
              {currentMovie.ageRating && (
                <span className="px-1.5 py-0.5 border border-white/80 rounded-sm leading-none flex items-center justify-center">
                  {currentMovie.ageRating}
                </span>
              )}
              {currentMovie.categories && currentMovie.categories.length > 0 && (
                <span>
                  {currentMovie.categories.map(cat => cat.labelTh || cat.name).join(" • ")}
                </span>
              )}
            </div>

            {currentMovie.contentWarnings && currentMovie.contentWarnings.length > 0 && (
              <div className="text-white text-xs md:text-sm font-bold italic drop-shadow-md">
                {mapContentWarnings(currentMovie.contentWarnings as string[])}
              </div>
            )}
          </div>

          <p
            className="text-white text-sm md:text-base max-w-xl leading-relaxed font-bold drop-shadow-lg select-none animate-fade-in line-clamp-2 md:line-clamp-3"
            key={`desc-${currentMovie.id}`}
          >
            {currentMovie.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="brand"
              onClick={() => onPlayClick(currentMovie)}
              className="w-[120px] md:w-[140px] h-[48px] md:h-[56px] !rounded-full flex items-center justify-center transition-all bg-gradient-to-r from-[#CAA22A] to-[#A47E1C] hover:scale-105 active:scale-95 shadow-lg border-none p-0"
            >
              <PlayArrowIcon className="text-white !text-4xl md:!text-5xl" />
            </Button>

            <Button
              variant="outline"
              onClick={() => onToggleFavorite(currentMovie.id)}
              className={`w-[48px] md:w-[56px] h-[48px] md:h-[56px] !rounded-full p-0 flex items-center justify-center transition-all shadow-lg border border-white/40 ${
                favorites.some((fav) => fav.id === currentMovie.id)
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-[#333333]/80 text-white hover:bg-[#444444]/90 hover:scale-105 active:scale-95"
              }`}
            >
              {favorites.some((fav) => fav.id === currentMovie.id) ? (
                <CheckIcon className="!text-3xl md:!text-4xl" />
              ) : (
                <AddIcon className="!text-3xl md:!text-4xl" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 animate-fade-in shrink-0">
          {nextMovies.map((movie, idx) => (
            <div
              key={`thumb-${movie.id}-${idx}`}
              onClick={() => setActiveIndex(heroMovies.findIndex(m => m.id === movie.id))}
              className={`relative w-[70px] h-[105px] md:w-[90px] md:h-[135px] rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 ${
                idx === 0 ? "border-2 border-white/50 scale-105" : "hover:scale-105 hover:-translate-y-2 opacity-80 hover:opacity-100"
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.thumbnail})` }}
              />
              {idx === 0 && (
                <div className="absolute inset-0 border-[3px] border-transparent rounded-xl" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroMovies.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`ไปยังภาพยนตร์ที่ ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === activeIndex
                ? "bg-[#c19a3b] scale-125"
                : "bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
