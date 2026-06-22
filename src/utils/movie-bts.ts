import { Movie, BtsVideoItem } from "@/core/domain/movie";
import { getYouTubeId } from "@/utils/youtube";

export function mapMoviesToBtsVideos(movies: Movie[]): BtsVideoItem[] {
  const items: BtsVideoItem[] = [];

  movies.forEach((movie) => {
    const btsClips = movie.btsVideos || [];
    btsClips.forEach((videoUrl, index) => {
      const videoId = getYouTubeId(videoUrl) || "";
      const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "";

      const titleSuffix = btsClips.length > 1 ? ` (พาร์ท ${index + 1})` : "";
      const title = `เบื้องหลัง: ${movie.title}${titleSuffix}`;

      items.push({
        id: `${movie.id}-${index}`,
        movie,
        videoUrl,
        title,
        thumbnailUrl,
      });
    });
  });

  return items;
}
