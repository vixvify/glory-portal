"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMovieQueryById } from "@/hooks/db/use-movies";
import { useYoutubePlayer } from "@/hooks/use-youtube-player";
import { watchSessionService } from "@/infra/container";
import { getYouTubeId } from "@/utils/youtube";
import { useAppStore } from "@/store/use-store";
import Loading from "@/app/loading";

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: movie, isLoading, error } = useMovieQueryById(params.id);
  const [showControls, setShowControls] = useState(true);
  const currentUser = useAppStore((s) => s.currentUser);

  const videoId = movie ? (getYouTubeId(movie.youtubeUrl) ?? "") : "";

  useYoutubePlayer({
    containerId: "yt-player",
    videoId,
    movieId: params.id,
    userId: currentUser?.email || "",
    source: "main_movie",
    onSessionEnd: currentUser?.email
      ? (payload) => watchSessionService.postWatchSession(payload).catch(console.error)
      : () => {},
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !movie) {
    return (
      <div className="w-screen h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          เกิดข้อผิดพลาดในการโหลดภาพยนตร์
        </h2>
        <p className="text-sm text-zinc-400 max-w-md">
          ไม่สามารถดึงข้อมูลภาพยนตร์ได้ หรือไม่มีข้อมูลภาพยนตร์นี้ในระบบ
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-brand text-black font-bold rounded-lg hover:bg-brand/90 active:scale-95 transition-all cursor-pointer"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative flex items-center justify-center select-none">
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-50 transition-opacity duration-300 flex items-center gap-4 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-white cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="ย้อนกลับ"
        >
          <ArrowBackIcon className="text-xl" />
        </button>
        <div>
          <span className="text-xs font-semibold tracking-widest text-brand uppercase">
            กำลังรับชม
          </span>
          <h1 className="text-base md:text-lg font-bold text-white tracking-wide leading-tight">
            {movie.title}
          </h1>
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full z-0 bg-black">
        <div id="yt-player" className="w-full h-full border-none" />
      </div>
    </div>
  );
}
