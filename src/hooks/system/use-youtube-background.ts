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

    // 1. Listen for PLAYING from YouTube
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      // Stop pinging once we get ANY response from YouTube
      clearInterval(initInterval);

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.event === "onStateChange" && data?.info === 1 && !hasPlayed) {
          hasPlayed = true;
          timer = setTimeout(() => setVideoLoaded(true), 3800);
        }

        // Also catch if it's already playing via infoDelivery
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

    // 2. Ask iframe to send events
    const listenToIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }),
        "https://www.youtube.com",
      );
    };

    // 3. Force video play
    const forcePlay = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "https://www.youtube.com",
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

  return {
    videoLoaded,
    iframeRef,
    backgroundEmbedUrl,
  };
}
