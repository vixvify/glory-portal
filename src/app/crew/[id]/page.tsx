"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import MovieIcon from "@mui/icons-material/Movie";
import EmailIcon from "@mui/icons-material/Email";
import Loading from "@/app/loading";
import { useCrewMemberQueryById } from "@/hooks/use-crew-members";

// Role localization mapping
const ROLE_MAPPING: Record<string, string> = {
  director: "ผู้กำกับ (Director)",
  producer: "ผู้อำนวยการสร้าง (Producer)",
  writer: "ผู้เขียนบท (Writer)",
  cast: "นักแสดง (Cast)",
};

export default function CrewProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: crewMember,
    isLoading,
    error,
  } = useCrewMemberQueryById(params.id);

  // Group filmography by role
  const groupedMovieCrews = useMemo(() => {
    if (!crewMember?.movieCrews) return {};
    const groups: Record<string, typeof crewMember.movieCrews> = {};

    crewMember.movieCrews.forEach((mc) => {
      const roleLower = mc.role.toLowerCase();
      const roleTitle = ROLE_MAPPING[roleLower] || mc.role;

      if (!groups[roleTitle]) {
        groups[roleTitle] = [];
      }
      groups[roleTitle].push(mc);
    });

    return groups;
  }, [crewMember]);

  // Derive unique roles for tags
  const crewRoles = useMemo(() => {
    return Object.keys(groupedMovieCrews);
  }, [groupedMovieCrews]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !crewMember) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold tracking-wide">
            ไม่พบข้อมูลทีมงาน
          </h2>
          <p className="text-sm text-zinc-400">
            ขออภัย ไม่พบประวัติหรือรายละเอียดของทีมงานท่านนี้ในระบบ
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-black font-semibold rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2 justify-center mx-auto"
          >
            <ArrowBackIcon className="text-lg" /> กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black pb-24">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 pt-28 space-y-12 animate-fade-in">
        <div className="flex items-center gap-2 text-xs text-zinc-555">
          <Link
            href="/"
            className="hover:text-brand transition-colors flex items-center gap-1"
          >
            <ArrowBackIcon className="text-sm" /> หน้าหลัก
          </Link>
          <span>/</span>
          <span className="text-zinc-400">ทีมงานและนักแสดง</span>
          <span>/</span>
          <span className="text-zinc-200">{crewMember.name}</span>
        </div>

        <div className="relative overflow-hidden bg-zinc-900/25 border border-zinc-800/40 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl backdrop-blur-md">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-3 border-brand/50 shadow-2xl shrink-0 group aspect-square">
            {crewMember.photoUrl ? (
              <img
                src={crewMember.photoUrl}
                alt={crewMember.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-650">
                <PersonIcon className="text-6xl md:text-7xl" />
              </div>
            )}
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-1.5">
              <span className="text-xs font-bold tracking-widest text-brand uppercase bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md inline-block">
                CREW PROFILE
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-wide text-white drop-shadow-md">
                {crewMember.name}
              </h1>
            </div>

            {crewMember.email && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-450 hover:text-white transition-colors">
                <EmailIcon className="text-base text-brand" />
                <a href={`mailto:${crewMember.email}`}>{crewMember.email}</a>
              </div>
            )}

            {crewRoles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                {crewRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded-full"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {crewRoles.length > 0 ? (
            Object.entries(groupedMovieCrews).map(([roleTitle, items]) => (
              <div key={roleTitle} className="space-y-6 animate-fade-in">
                <div className="border-b border-zinc-800/80 pb-2.5 flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
                    <span className="w-3 h-3 bg-brand rounded-full inline-block animate-pulse" />
                    บทบาทหน้าที่:{" "}
                    <span className="text-brand font-black">{roleTitle}</span>
                  </h2>
                  <span className="text-xs text-zinc-450 font-bold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                    ทั้งหมด {items.length} เรื่อง
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {items.map((mc) => {
                    const movie = mc.movie;
                    if (!movie) return null;

                    return (
                      <Link
                        href={`/movies/${movie.id}`}
                        key={mc.id}
                        className="group/card block"
                      >
                        <div className="bg-zinc-900/30 border border-zinc-850 hover:border-brand/45 rounded-2xl overflow-hidden shadow-lg hover:shadow-brand/5 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col h-full">
                          <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
                            <img
                              src={movie.thumbnail}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="text-[10px] font-bold text-black bg-brand px-2.5 py-1 rounded-md shadow-md">
                                คลิกเพื่อดูรายละเอียด
                              </span>
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover/card:text-brand line-clamp-1 transition-colors">
                                {movie.title}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold">
                                <span>{movie.year}</span>
                                <span>•</span>
                                <span className="text-zinc-400">
                                  {movie.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-zinc-900/10 border border-zinc-800/30 p-12 text-center rounded-3xl">
              <p className="text-sm text-zinc-550 italic font-light">
                ยังไม่มีข้อมูลการมีส่วนร่วมในภาพยนตร์สำหรับสมาชิกทีมงานท่านนี้
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
