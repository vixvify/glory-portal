"use client";

import { useScrollRow } from "@/hooks/system/use-scroll-row";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import Link from "next/link";

interface MovieRankRowProps {
  title: string;
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  favorites: Movie[];
  onToggleFavorite: (movieId: string) => void;
}

export default function MovieRankRow({
  title,
  movies,
  onPlayClick,
  favorites,
  onToggleFavorite,
}: MovieRankRowProps) {
  const { rowRef, showLeftArrow, showRightArrow, handleScroll } =
    useScrollRow(movies);

  const topTenMovies = movies.slice(0, 10);

  if (topTenMovies.length === 0) return null;

  return (
    <div className="space-y-4 group/row relative">
      <h3 className="text-base md:text-lg lg:text-xl font-bold text-zinc-100 tracking-wide hover:text-white cursor-pointer transition-colors duration-200 pl-3.5 border-l-3 border-brand/85 inline-block">
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
          ref={rowRef}
          className="flex overflow-x-auto gap-6 pt-6 pb-16 px-4 no-scrollbar scroll-smooth snap-x snap-mandatory overflow-y-hidden"
        >
          {topTenMovies.map((movie, index) => {
            return (
              <Link href={`/movies/${movie.id}`} key={movie.id}>
                <div className="flex-none w-[210px] sm:w-[250px] md:w-[290px] relative snap-start group/rank flex items-end h-[180px] sm:h-[220px] md:h-[260px] select-none">
                  <div
                    className={`absolute ${
                      index === 0
                        ? "left-0"
                        : "left-[-25px] sm:left-[-22px] md:left-[-28px]"
                    } bottom-[-1.5rem] sm:bottom-[-2.2rem] md:bottom-[-2.8rem] z-0 select-none text-stroke-netflix font-black leading-none flex items-end transition-all duration-300 group-hover/rank:scale-[1.08] group-hover/rank:-translate-y-1.5`}
                    style={{
                      fontSize: "clamp(7rem, 15vw, 14.5rem)",
                      transform: `scale(0.8)`,
                      transformOrigin: "bottom left",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="w-[80%] ml-auto relative z-10 h-full">
                    <MovieCard
                      movie={movie}
                      onPlayClick={onPlayClick}
                      isFavorite={favorites.some((fav) => fav.id === movie.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                </div>
              </Link>
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
