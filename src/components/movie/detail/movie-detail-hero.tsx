"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
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

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!backgroundEmbedUrl) return;

    let timer: NodeJS.Timeout;
    // eslint-disable-next-line prefer-const
    let initInterval: NodeJS.Timeout;
    let hasPlayed = false;
    let lastReturnTime = 0;

    // 1. Listen for PLAYING from YouTube
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      // Stop pinging once we get ANY response from YouTube
      clearInterval(initInterval);

      try {
        const data = typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data;

        if (data?.event === "onStateChange" && data?.info === 1 && !hasPlayed) {
          hasPlayed = true;
          timer = setTimeout(() => setVideoLoaded(true), 3800);
        }
        
        // Also catch if it's already playing via infoDelivery
        if (data?.event === "infoDelivery" && data?.info?.playerState === 1 && !hasPlayed) {
          hasPlayed = true;
          timer = setTimeout(() => setVideoLoaded(true), 3800);
        }
      } catch { /* ignore */ }
    };

    // 2. Ask iframe to send events
    const listenToIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }),
        "https://www.youtube.com"
      );
    };

    // 3. Force video play
    const forcePlay = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "https://www.youtube.com"
      );
    };

    // 4. Handle Leaving (Hide)
    const handleLeave = () => {
      setVideoLoaded(false);
      hasPlayed = false;
      clearTimeout(timer);
    };

    // 5. Handle Returning (Show)
    const handleReturn = () => {
      // Debounce: Prevent rapid multiple calls (e.g. visibility + focus firing together)
      const now = Date.now();
      if (now - lastReturnTime < 1000) return;
      lastReturnTime = now;

      forcePlay();
      setTimeout(listenToIframe, 500);
    };

    // 6. Event Listeners
    const handleVisibilityChange = () => {
      if (document.hidden) handleLeave();
      else handleReturn();
    };

    const handleWindowBlur = () => handleLeave();
    const handleWindowFocus = () => handleReturn();

    // 7. Initialization
    window.addEventListener("message", handleMessage);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    
    // Ping iframe every 500ms until we get a response
    initInterval = setInterval(listenToIframe, 500);

    // 8. Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(initInterval);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [backgroundEmbedUrl]);

  const isPortrait = movie.aspectRatio === "portrait" || movie.aspectRatio === "portait";

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl glass-panel">
      <div className={`relative w-full bg-black/45 overflow-hidden ${isPortrait
          ? "min-h-[450px] md:h-[520px] flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start p-8 md:p-12 gap-8"
          : "h-[420px] md:h-[520px]"
        }`}>
        {!isPortrait && backgroundEmbedUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <iframe
              ref={iframeRef}
              src={`${backgroundEmbedUrl}&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
              title="Trailer Background"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[1.35] opacity-45"
              style={{ pointerEvents: "none" }}
              tabIndex={-1}
            />
          </div>
        )}

        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0 ${isPortrait ? "hidden" : ""
            }`}
          style={{
            backgroundImage: `url(${movie.thumbnail})`,
            ...(!isPortrait ? {
              opacity: videoLoaded ? 0 : 1,
              visibility: videoLoaded ? "hidden" : "visible",
            } : {})
          }}
        />

        <div className="absolute inset-0 bg-transparent pointer-events-auto z-10" />

        <div
          className="absolute inset-0 z-[9] pointer-events-none"
          style={{
            backgroundImage: isPortrait
              ? "linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.4) 65%, rgba(var(--theme-bg-rgb), 0.8) 100%)"
              : `
                linear-gradient(to top, var(--theme-bg) 0%, rgba(var(--theme-bg-rgb), 0.3) 65%, rgba(var(--theme-bg-rgb), 0.75) 100%),
                linear-gradient(to right, rgba(var(--theme-bg-rgb), 0.9) 0%, rgba(var(--theme-bg-rgb), 0.25) 45%, transparent 100%)
              `,
          }}
        />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 w-11 h-11 rounded-md bg-black/50 hover:bg-black/80 border border-zinc-700/60 flex items-center justify-center text-white cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 z-20"
          aria-label="ย้อนกลับ"
        >
          <ArrowBackIcon className="text-xl" />
        </button>

        {isPortrait ? (
          <div className="relative z-20 flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full mt-12 md:mt-0">
            <div className="relative w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0 group/poster">
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                className="object-cover transition-transform duration-500 group-hover/poster:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={onPlayClick}
                  className="w-12 h-12 rounded-full bg-brand text-black flex items-center justify-center shadow-lg transform scale-75 group-hover/poster:scale-100 transition-transform duration-300 cursor-pointer"
                >
                  <PlayArrowIcon className="text-2xl ml-0.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              {movie.creator && (
                <div className="text-[10px] font-extrabold tracking-widest text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-sm inline-block uppercase">
                  GLORY ORIGINAL
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide drop-shadow-lg leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Button variant="brand" size="md" onClick={onPlayClick} className="text-zinc-950 font-extrabold px-6 active:scale-95 transition-transform">
                  <PlayArrowIcon className="text-xl mr-1.5" />
                  เล่น
                </Button>

                {movie.trailerUrl && (
                  <Button variant="secondary" size="md" onClick={onTrailerClick} className="px-6 active:scale-95 transition-transform">
                    <PlayArrowIcon className="text-xl mr-1.5 text-brand" />
                    ตัวอย่างภาพยนตร์
                  </Button>
                )}

                <button className="flex items-center justify-center w-11 h-11 rounded-md border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-emerald-400 cursor-pointer transition-colors">
                  <CheckIcon className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-6 left-6 md:left-12 flex flex-wrap items-end gap-4 z-20 w-[90%]">
            <div>
              {movie.creator && (
                <div className="text-[10px] font-extrabold tracking-widest text-brand mb-2.5 bg-brand/5 border border-brand/25 px-2.5 py-1 rounded-sm inline-block uppercase">
                  GLORY ORIGINAL
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wide drop-shadow-lg mb-5 leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="brand" size="md" onClick={onPlayClick} className="text-zinc-950 font-extrabold px-6">
                  <PlayArrowIcon className="text-xl mr-1.5" />
                  เล่น
                </Button>

                {movie.trailerUrl && (
                  <Button variant="secondary" size="md" onClick={onTrailerClick} className="px-6">
                    <PlayArrowIcon className="text-xl mr-1.5 text-brand" />
                    ตัวอย่างภาพยนตร์
                  </Button>
                )}

                <button className="flex items-center justify-center w-11 h-11 rounded-md border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-emerald-400 cursor-pointer transition-colors">
                  <CheckIcon className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
