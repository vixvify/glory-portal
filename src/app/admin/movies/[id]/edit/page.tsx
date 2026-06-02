"use client";

import { useParams } from "next/navigation";
import { useMovieQueryById } from "@/hooks/use-movies";
import Loading from "@/app/loading";
import { MovieForm } from "@/components/ui/movie-form";

export default function EditMoviePage() {
  const params = useParams<{ id: string }>();
  const { data: movie, isLoading } = useMovieQueryById(params.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 font-light">ไม่พบข้อมูลภาพยนตร์สั้นที่ต้องการแก้ไข</p>
      </div>
    );
  }

  return <MovieForm editingMovie={movie} />;
}
