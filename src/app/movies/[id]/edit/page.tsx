"use client";

import { useParams } from "next/navigation";
import { useMovieQueryById } from "@/hooks/db/use-movies";
import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
  useCrewRolesQuery,
} from "@/hooks/db/use-master-data";
import { useCrewMembersQuery } from "@/hooks/db/use-crew-members";
import { MovieForm } from "@/app/create/movie/movie-form";

export default function EditMoviePage() {
  const params = useParams<{ id: string }>();
  const { data: movie, isLoading: isMovieLoading } = useMovieQueryById(
    params.id,
  );
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { data: universities = [], isLoading: isUniversitiesLoading } =
    useUniversitiesQuery();
  const { data: crewRoles = [], isLoading: isCrewRolesLoading } =
    useCrewRolesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isMovieLoading ||
    isCategoriesLoading ||
    isUniversitiesLoading ||
    isCrewRolesLoading ||
    isCrewLoading;

  if (isMasterLoading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 font-light">
          ไม่พบข้อมูลภาพยนตร์สั้นที่ต้องการแก้ไข
        </p>
      </div>
    );
  }

  return (
    <MovieForm
      editingMovie={movie}
      categories={categories}
      universities={universities}
      crewRoles={crewRoles}
      availableCrew={availableCrew}
    />
  );
}
