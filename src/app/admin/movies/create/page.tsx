"use client";

import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useAgeRatingsQuery,
  useUniversitiesQuery,
} from "@/hooks/use-master-data";
import { useCrewMembersQuery } from "@/hooks/use-crew-members";
import { MovieForm } from "../movieform";

export default function CreateMoviePage() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategoriesQuery();
  const { data: ageRatings = [], isLoading: isAgeRatingsLoading } =
    useAgeRatingsQuery();
  const { data: universities = [], isLoading: isUniversitiesLoading } =
    useUniversitiesQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isCategoriesLoading ||
    isAgeRatingsLoading ||
    isUniversitiesLoading ||
    isCrewLoading;

  if (isMasterLoading) {
    return <Loading />;
  }

  return (
    <MovieForm
      categories={categories}
      ageRatings={ageRatings}
      universities={universities}
      availableCrew={availableCrew}
    />
  );
}

