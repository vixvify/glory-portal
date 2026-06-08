export const getYouTubeBackgroundEmbedUrl = (videoId: string): string => {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    playsinline: "1",
    enablejsapi: "1",
    disablekb: "1",
    fs: "0",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};
