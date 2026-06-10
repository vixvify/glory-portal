"use client";

import Link from "next/link";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MovieCrew } from "@/core/domain/movie";
import { useScrollRow } from "@/hooks/use-scroll-row";

interface Props {
  crew: MovieCrew[];
}

export default function MovieCrewRow({ crew }: Props) {
  const {
    rowRef,
    showLeftArrow,
    showRightArrow,
    handleScroll,
  } = useScrollRow(crew);

  if (crew.length === 0) {
    return (
      <p className="text-xs text-zinc-550 italic font-light">
        ไม่มีข้อมูลทีมงานและนักแสดงสำหรับเรื่องนี้
      </p>
    );
  }

  return (
    <div className="space-y-5 pt-6 border-t border-zinc-800/60 group/row relative">
      <h4 className="text-base font-bold text-white tracking-wide uppercase pl-1">
        ทีมงานและนักแสดง
      </h4>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="เลื่อนซ้าย"
            className="absolute left-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-r-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-r border-zinc-800/20 cursor-pointer shadow-lg"
          >
            <ChevronLeftIcon className="text-3xl hover:scale-125 transition-transform" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-3.5 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {crew.map((member) => (
            <Link
              href={`/crew/${member.crewMember?.id}`}
              key={member.id}
              className="flex items-center gap-3.5 glass-card p-3 rounded-2xl group flex-shrink-0 w-60 snap-start cursor-pointer block"
            >
              {member.crewMember?.user?.photoUrl ? (
                <Image
                  src={member.crewMember.user.photoUrl}
                  alt={member.crewMember.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover bg-zinc-800 border border-zinc-700/50 group-hover:border-brand/40 transition-colors flex-shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                  <PersonIcon className="text-xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-zinc-200 group-hover:text-brand transition-colors flex items-center gap-1.5 truncate">
                  {member.crewMember?.name}
                  {member.crewMember?.userId && (
                    <span
                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"
                      title="ผู้ใช้งานระบบ"
                    />
                  )}
                </p>
                <p className="text-[10px] text-brand uppercase tracking-widest font-medium mt-0.5 truncate">
                  {member.role}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="เลื่อนขวา"
            className="absolute right-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white z-30 flex items-center justify-center rounded-l-lg transition-all duration-300 opacity-0 group-hover/row:opacity-100 border-l border-zinc-800/20 cursor-pointer shadow-lg"
          >
            <ChevronRightIcon className="text-3xl hover:scale-125 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
