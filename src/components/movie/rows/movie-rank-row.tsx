"use client";

import { useScrollRow } from "@/hooks/system/use-scroll-row";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import Link from "next/link";
import EmptyState from "@/components/ui/empty-state";

interface MovieRankRowProps {
  title: string;
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
}

export default function MovieRankRow({
  title,
  movies,
  onPlayClick,
}: MovieRankRowProps) {
  const { rowRef, showLeftArrow, showRightArrow, handleScroll } =
    useScrollRow(movies);

  const topTenMovies = movies.slice(0, 10);

  return (
    <div className="space-y-4 group/row relative">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-luxury-gold tracking-wide hover:opacity-80 cursor-pointer transition-opacity duration-200 inline-block drop-shadow-sm">
        {title}
      </h3>

      {topTenMovies.length === 0 ? (
        <EmptyState title={`ยังไม่มี${title}`} />
      ) : (
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
            className="flex overflow-x-auto gap-4 py-4 px-1.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {topTenMovies.map((movie, index) => {
              return (
                <Link
                  href={`/movies/${movie.id}`}
                  key={movie.id}
                  className="relative flex-none snap-start transition-all duration-300 w-[280px] sm:w-[340px] md:w-[400px] group/rank"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.4)_30%,_transparent_60%)] z-20 pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 z-25 font-sans text-4xl sm:text-5xl md:text-6xl font-black text-luxury-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] select-none">
                    {index + 1}
                  </div>
                  <MovieCard
                    movie={movie}
                    onPlayClick={onPlayClick}
                  />
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
      )}
    </div>
  );
}
