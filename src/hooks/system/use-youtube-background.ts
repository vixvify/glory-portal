import { useState, useEffect, useMemo, useRef } from "react";
import { getYouTubeId } from "@/utils/youtube";
import { getYouTubeBackgroundEmbedUrl } from "@/core/constants/youtube";

export function useYouTubeBackground(trailerUrl: string | null | undefined) {
  const videoId = useMemo(() => getYouTubeId(trailerUrl), [trailerUrl]);

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

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      clearInterval(initInterval);

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.event === "onStateChange" && data?.info === 1 && !hasPlayed) {
          hasPlayed = true;
          timer = setTimeout(() => setVideoLoaded(true), 3800);
        }

        if (
          data?.event === "infoDelivery" &&
          data?.info?.playerState === 1 &&
          !hasPlayed
        ) {
          hasPlayed = true;
          timer = setTimeout(() => setVideoLoaded(true), 3800);
        }
      } catch {
        /* ignore */
      }
    };

    const listenToIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }),
        "https://www.youtube.com",
      );
    };

    const forcePlay = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "https://www.youtube.com",
      );
    };

    const handleLeave = () => {
      setVideoLoaded(false);
      hasPlayed = false;
      clearTimeout(timer);
    };

    const handleReturn = () => {
      const now = Date.now();
      if (now - lastReturnTime < 1000) return;
      lastReturnTime = now;

      forcePlay();
      setTimeout(listenToIframe, 500);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleLeave();
      else handleReturn();
    };

    const handleWindowBlur = () => handleLeave();
    const handleWindowFocus = () => handleReturn();

    window.addEventListener("message", handleMessage);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    initInterval = setInterval(listenToIframe, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(initInterval);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [backgroundEmbedUrl]);

  return {
    videoLoaded,
    iframeRef,
    backgroundEmbedUrl,
  };
}
