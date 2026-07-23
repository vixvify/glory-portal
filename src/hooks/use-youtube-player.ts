"use client";

import { useEffect, useRef } from "react";
import type { WatchSessionPayload, SeekEvent, CompletionType } from "@/core/domain/watch-session";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYoutubePlayerOptions {
  containerId: string;
  videoId: string;
  movieId: string;
  userId: string;
  source: WatchSessionPayload["source"];
  onSessionEnd: (payload: WatchSessionPayload) => void;
}

export function useYoutubePlayer({
  containerId,
  videoId,
  movieId,
  userId,
  source,
  onSessionEnd,
}: UseYoutubePlayerOptions) {
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const session = useRef({
    startSecond: 0,
    endSecond: 0,
    watchedSeconds: 0,
    duration: 0,
    pauseCount: 0,
    replayCount: 0,
    seekEvents: [] as SeekEvent[],
    lastCurrentTime: 0,
    completionType: "abandoned" as CompletionType,
    hasEnded: false,
  });

  const propsRef = useRef({ userId, movieId, source, onSessionEnd });
  useEffect(() => {
    propsRef.current = { userId, movieId, source, onSessionEnd };
  }, [userId, movieId, source, onSessionEnd]);

  useEffect(() => {
    if (!videoId) return;

    const initPlayer = () => {
      playerRef.current = new YT.Player(containerId, {
        videoId,
        playerVars: { enablejsapi: 1, rel: 0 },
        events: {
          onReady: (e) => {
            session.current.duration = e.target.getDuration();
          },
          onStateChange: handleStateChange,
        },
      });
    };

    if (typeof window === "undefined") return;

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const handleBeforeUnload = () => {
      stopInterval();
      session.current.completionType = "abandoned";
      session.current.endSecond =
        playerRef.current?.getCurrentTime() ?? session.current.endSecond;
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
      navigator.sendBeacon(
        `${apiBase}/watch-sessions`,
        new Blob([JSON.stringify(buildPayload())], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopInterval();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const s = session.current;
      if (s.completionType !== "completed" && s.completionType !== "abandoned") {
        s.completionType = "abandoned";
        try {
          s.endSecond = playerRef.current?.getCurrentTime() ?? s.endSecond;
        } catch {
        }
        propsRef.current.onSessionEnd(buildPayload());
      }

      playerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  function startInterval() {
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;

      const current = playerRef.current.getCurrentTime();
      const diff = current - session.current.lastCurrentTime;

      if (diff > 0 && diff < 2) {
        session.current.watchedSeconds += diff;
      }

      if (Math.abs(diff) > 2) {
        session.current.seekEvents.push({
          direction: diff > 0 ? "forward" : "backward",
          time: Math.abs(diff),
        });
      }

      session.current.lastCurrentTime = current;
    }, 1000);
  }

  function stopInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handleStateChange(event: YT.OnStateChangeEvent) {
    const player = playerRef.current!;

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        if (session.current.startSecond === 0) {
          session.current.startSecond = player.getCurrentTime();
        }
        if (session.current.hasEnded) {
          session.current.replayCount++;
          session.current.hasEnded = false;
        }
        startInterval();
        break;

      case YT.PlayerState.PAUSED:
        stopInterval();
        session.current.pauseCount++;
        session.current.endSecond = player.getCurrentTime();
        session.current.completionType = "paused";
        propsRef.current.onSessionEnd(buildPayload());
        break;

      case YT.PlayerState.ENDED:
        stopInterval();
        session.current.hasEnded = true;
        session.current.endSecond = player.getDuration();
        session.current.completionType = "completed";
        propsRef.current.onSessionEnd(buildPayload());
        break;

      case YT.PlayerState.BUFFERING:
        stopInterval();
        break;
    }
  }

  function buildPayload(): WatchSessionPayload {
    const s = session.current;
    const watchedSeconds = Math.round(s.watchedSeconds);
    const percentWatched =
      s.duration > 0 ? Math.min((watchedSeconds / s.duration) * 100, 100) : 0;

    return {
      movieId: propsRef.current.movieId,
      userId: propsRef.current.userId,
      source: propsRef.current.source,
      startSecond: s.startSecond,
      endSecond: s.endSecond,
      watchedSeconds,
      duration: s.duration,
      percentWatched,
      completionType: s.completionType,
      pauseCount: s.pauseCount,
      replayCount: s.replayCount,
      seekEvents: [...s.seekEvents],
    };
  }
}
