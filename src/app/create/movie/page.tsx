"use client";

import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
} from "@/hooks/db/use-master-data";
import { useCrewMembersQuery } from "@/hooks/db/use-crew-members";
import { MovieForm } from "./movie-form";

export default function CreateMoviePage() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { data: universities = [], isLoading: isUniversitiesLoading } =
    useUniversitiesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isCategoriesLoading || isUniversitiesLoading || isCrewLoading;

  if (isMasterLoading) {
    return <Loading />;
  }

  return (
    <MovieForm
      categories={categories}
      universities={universities}
      availableCrew={availableCrew}
    />
  );
}
