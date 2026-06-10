"use client";

import { useState, useEffect, useMemo } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import { Movie } from "@/core/domain/movie";
import { Button } from "@/components/ui/button";
import { getYouTubeId } from "@/utils/youtube";
import { getYouTubeBackgroundEmbedUrl } from "@/core/constants/youtube";
import { useRouter } from "next/navigation";

interface Props {
  movie: Movie;
  onPlayClick: () => void;
  onTrailerClick: () => void;
}

export default function MovieDetailHero({
  movie,
  onPlayClick,
  onTrailerClick,
}: Props) {
  const router = useRouter();

  const videoId = useMemo(
    () => getYouTubeId(movie.trailerUrl),
    [movie.trailerUrl],
  );
  const backgroundEmbedUrl = useMemo(() => {
    if (!videoId) return null;
    return getYouTubeBackgroundEmbedUrl(videoId);
  }, [videoId]);

  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!backgroundEmbedUrl) return;
    const timer = setTimeout(() => setVideoLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, [backgroundEmbedUrl]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl glass-panel">
      <div className="relative h-[420px] md:h-[520px] w-full bg-black/45 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0"
          style={{
            backgroundImage: `url(${movie.thumbnail})`,
            opacity: videoLoaded ? 0 : 0.8,
            visibility: videoLoaded ? "hidden" : "visible",
          }}
        />

        {backgroundEmbedUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <iframe
              src={backgroundEmbedUrl}
              title="Trailer Background"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className={`absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[1.35] transition-opacity duration-1000 ${
                videoLoaded ? "opacity-45" : "opacity-0"
              }`}
              style={{ pointerEvents: "none" }}
              tabIndex={-1}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-transparent pointer-events-auto z-10" />

        <div
          className="absolute inset-0 z-[9] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.3) 65%, rgba(var(--theme-bg-rgb), 0.75) 100%),
              linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.9) 0%, rgba(var(--theme-bg-rgb), 0.25) 45%, transparent 100%)
            `,
          }}
        />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-zinc-700/60 backdrop-blur-md flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 z-20"
          aria-label="ย้อนกลับ"
        >
          <ArrowBackIcon className="text-xl" />
        </button>

        <div className="absolute bottom-6 left-6 md:left-12 flex flex-wrap items-end gap-4 z-20 w-[90%]">
          <div>
            {movie.creator && (
              <div className="text-xs font-semibold tracking-widest text-brand mb-2.5 bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-md inline-block">
                GLORY ORIGINAL
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-md mb-5 leading-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="white" size="md" onClick={onPlayClick}>
                <PlayArrowIcon className="text-xl mr-1.5" />
                เล่น
              </Button>

              {movie.trailerUrl && (
                <Button variant="secondary" size="md" onClick={onTrailerClick}>
                  <PlayArrowIcon className="text-xl mr-1.5 text-brand" />
                  ตัวอย่างภาพยนตร์
                </Button>
              )}

              <button className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-emerald-400 cursor-pointer transition-colors">
                <CheckIcon className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
