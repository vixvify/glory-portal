"use client";

import { useScrollRow } from "@/hooks/system/use-scroll-row";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Movie } from "@/core/domain/movie";
import MovieCard from "../cards/movie-card";
import MovieCardPortrait from "../cards/movie-card-portrait";
import Link from "next/link";
import EmptyState from "@/components/ui/empty-state";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlayClick: (movie: Movie) => void;
  directPlay?: boolean;
  orientation?: "landscape" | "portrait";
}

export default function MovieRow({
  title,
  movies,
  onPlayClick,
  directPlay = false,
  orientation = "landscape",
}: MovieRowProps) {
  const { rowRef, showLeftArrow, showRightArrow, handleScroll } =
    useScrollRow(movies);

  return (
    <div className="space-y-3 group/row relative">
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-100 tracking-wide hover:text-white cursor-pointer transition-colors duration-200 inline-block">
        {title}
      </h3>

      {movies.length === 0 ? (
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
            {movies.map((movie) => {
              const cardContent = orientation === "landscape" ? (
                <div className="flex-none snap-start w-[280px] sm:w-[340px] md:w-[400px]">
                  <MovieCard
                    movie={movie}
                    onPlayClick={onPlayClick}
                  />
                </div>
              ) : (
                <div className="flex-none snap-start w-[160px] sm:w-[200px] md:w-[240px]">
                  <MovieCardPortrait
                    movie={movie}
                    onPlayClick={onPlayClick}
                  />
                </div>
              );

              if (directPlay) {
                return (
                  <div key={movie.id} onClick={() => onPlayClick(movie)}>
                    {cardContent}
                  </div>
                );
              }

              return (
                <Link href={`/movies/${movie.id}`} key={movie.id}>
                  {cardContent}
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
