import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/core/domain/movie";

interface MovieCardThumbProps {
  movie: Movie;
}

export function MovieCardThumb({ movie }: MovieCardThumbProps) {
  return (
    <Link
      href={`/watch/${movie.id}`}
      className="group block relative aspect-video rounded-xl overflow-hidden bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail Image */}
      <Image
        src={movie.thumbnail}
        alt={movie.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-white font-bold text-lg line-clamp-1 truncate">
          {movie.title}
        </h3>
        <p className="text-zinc-300 text-xs line-clamp-2">
          {movie.description}
        </p>
      </div>

      {/* Duration (if available) - optional badge at bottom right */}
      {movie.duration > 0 && (
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded backdrop-blur-sm group-hover:opacity-0 transition-opacity duration-300">
          {Math.floor(movie.duration / 60)}:
          {(movie.duration % 60).toString().padStart(2, "0")}
        </div>
      )}
    </Link>
  );
}
