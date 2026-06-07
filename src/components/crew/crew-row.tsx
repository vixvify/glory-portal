"use client";

import { useScrollRow } from "@/hooks/use-scroll-row";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import { CrewMember } from "@/core/domain/crew";
import Link from "next/link";

interface CrewRowProps {
  title: string;
  crew: CrewMember[];
}

export default function CrewRow({ title, crew }: CrewRowProps) {
  const { rowRef, showLeftArrow, showRightArrow, handleScroll } =
    useScrollRow(crew);

  if (crew.length === 0) return null;

  return (
    <div className="space-y-2 group/row relative">
      <h3 className="text-base md:text-xl font-bold text-zinc-100 tracking-wide hover:text-white cursor-pointer transition-colors duration-200 pl-1 inline-block">
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
          className="flex overflow-x-auto gap-6 py-4 px-1.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {crew.map((member) => (
            <Link
              href={`/crew/${member.id}`}
              key={member.id}
              className="flex-none w-32 sm:w-40 flex flex-col items-center select-none group/item cursor-pointer snap-start"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-zinc-800/60 group-hover/item:border-brand/80 transition-all duration-300 shadow-md relative aspect-square">
                {member.user?.photoUrl ? (
                  <img
                    src={member.user.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover/item:text-brand transition-colors">
                    <PersonIcon className="text-4xl sm:text-5xl" />
                  </div>
                )}
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-semibold text-zinc-400 group-hover/item:text-white transition-colors truncate w-full text-center">
                {member.name}
              </span>
            </Link>
          ))}
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
