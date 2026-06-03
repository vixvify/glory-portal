export const getYouTubeId = (url: string | undefined | null): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const getYouTubeEmbedUrl = (
  url: string | undefined | null,
  autoplay = true,
): string => {
  const videoId = getYouTubeId(url);
  if (videoId) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
    });
    if (autoplay) {
      params.append("autoplay", "1");
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }
  return "https://www.youtube.com/embed/";
};
