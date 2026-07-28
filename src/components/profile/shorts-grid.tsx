import Image from "next/image";
import LocalPlayIcon from "@mui/icons-material/LocalPlay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Movie } from "@/core/domain/movie";

interface ShortsGridProps {
  movies: Movie[];
}

export function ShortsGrid({ movies }: ShortsGridProps) {
  const shorts = movies.filter(
    (m) => m.aspectRatio === "portrait" || m.aspectRatio === "vertical"
  );

  if (shorts.length === 0) {
    return (
      <div className="col-span-full py-10 text-center text-zinc-500 font-light border border-dashed border-zinc-800 rounded-xl">
        ยังไม่มีคลิปสั้น
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {shorts.map((short) => (
        <div
          key={short.id}
          className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden group cursor-pointer border border-zinc-800 hover:border-brand transition-colors"
        >
          <Image
            src={short.thumbnail}
            alt={short.title}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="text-xs font-medium line-clamp-2 drop-shadow-md">
              {short.title}
            </div>
            <div className="text-[10px] text-zinc-300 mt-1 flex items-center gap-1">
              <VisibilityIcon className="text-[10px]" /> {short.views || 0}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <LocalPlayIcon className="text-white text-lg ml-0.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
