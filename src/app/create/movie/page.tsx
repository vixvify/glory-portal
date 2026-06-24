"use client";

import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
  useSchoolsQuery,
  useStudiosQuery,
  useCrewRolesQuery,
} from "@/hooks/db/use-master-data";
import { useCrewMembersQuery } from "@/hooks/db/use-crew-members";
import { MovieForm } from "./movie-form";

export default function CreateMoviePage() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { data: universities = [], isLoading: isUniversitiesLoading } =
    useUniversitiesQuery();
  const { data: schools = [], isLoading: isSchoolsLoading } =
    useSchoolsQuery();
  const { data: studios = [], isLoading: isStudiosLoading } =
    useStudiosQuery();
  const { data: crewRoles = [], isLoading: isCrewRolesLoading } =
    useCrewRolesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isCategoriesLoading ||
    isUniversitiesLoading ||
    isSchoolsLoading ||
    isStudiosLoading ||
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
      studios={studios}
      crewRoles={crewRoles}
      availableCrew={availableCrew}
    />
  );
}
