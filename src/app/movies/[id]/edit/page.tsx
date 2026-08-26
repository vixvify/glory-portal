"use client";

import { useParams } from "next/navigation";
import { useMovieQueryById } from "@/hooks/db/use-movies";
import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
  useSchoolsQuery,
  useLanguagesQuery,
  useSubtitlesQuery,
  useColorTypesQuery,
  useContentWarningsQuery,
  useAgeRatingsQuery,
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
  const { data: universities = [], isLoading: isUniversitiesLoading } = useUniversitiesQuery();
  const { data: schools = [], isLoading: isSchoolsLoading } = useSchoolsQuery();
  const { data: languages = [], isLoading: isLanguagesLoading } = useLanguagesQuery();
  const { data: subtitles = [], isLoading: isSubtitlesLoading } = useSubtitlesQuery();
  const { data: colorTypes = [], isLoading: isColorTypesLoading } = useColorTypesQuery();
  const { data: contentWarnings = [], isLoading: isContentWarningsLoading } = useContentWarningsQuery();
  const { data: ageRatings = [], isLoading: isAgeRatingsLoading } = useAgeRatingsQuery();

  const { data: crewRoles = [], isLoading: isCrewRolesLoading } =
    useCrewRolesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isMovieLoading ||
    isCategoriesLoading ||
    isUniversitiesLoading ||
    isSchoolsLoading ||
    isLanguagesLoading ||
    isSubtitlesLoading ||
    isColorTypesLoading ||
    isContentWarningsLoading ||
    isAgeRatingsLoading ||
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
      schools={schools}
      languages={languages}
      subtitles={subtitles}
      colorTypes={colorTypes}
      contentWarnings={contentWarnings}
      ageRatings={ageRatings}
      crewRoles={crewRoles}
      availableCrew={availableCrew}
    />
  );
}
