"use client";

import Loading from "@/app/loading";
import {
  useCategoriesQuery,
  useAgeRatingsQuery,
  useUniversitiesQuery,
  useLanguagesQuery,
  useTargetGroupsQuery,
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
  const { data: languages = [], isLoading: isLanguagesLoading } =
    useLanguagesQuery();
  const { data: targetGroups = [], isLoading: isTargetGroupsLoading } =
    useTargetGroupsQuery();
  const { data: availableCrew = [], isLoading: isCrewLoading } =
    useCrewMembersQuery();

  const isMasterLoading =
    isCategoriesLoading ||
    isAgeRatingsLoading ||
    isUniversitiesLoading ||
    isLanguagesLoading ||
    isTargetGroupsLoading ||
    isCrewLoading;

  if (isMasterLoading) {
    return <Loading />;
  }

  return (
    <MovieForm
      categories={categories}
      ageRatings={ageRatings}
      universities={universities}
      languages={languages}
      targetGroups={targetGroups}
      availableCrew={availableCrew}
    />
  );
}

