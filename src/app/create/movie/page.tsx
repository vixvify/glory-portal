"use client";

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
import { MovieForm } from "./movie-form";

export default function CreateMoviePage() {
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

  return (
    <MovieForm
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
