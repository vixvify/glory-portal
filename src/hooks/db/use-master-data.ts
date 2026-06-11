import { useQuery } from "@tanstack/react-query";
import { masterDataService } from "@/infra/container";
import { Category, University, AgeRating, Language, TargetGroup } from "@/core/domain/movie";

export function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => masterDataService.getCategories(),
  });
}

export function useUniversitiesQuery() {
  return useQuery<University[], Error>({
    queryKey: ["universities"],
    queryFn: () => masterDataService.getUniversities(),
  });
}

export function useAgeRatingsQuery() {
  return useQuery<AgeRating[], Error>({
    queryKey: ["ageRatings"],
    queryFn: () => masterDataService.getAgeRatings(),
  });
}

export function useLanguagesQuery() {
  return useQuery<Language[], Error>({
    queryKey: ["languages"],
    queryFn: () => masterDataService.getLanguages(),
  });
}

export function useTargetGroupsQuery() {
  return useQuery<TargetGroup[], Error>({
    queryKey: ["targetGroups"],
    queryFn: () => masterDataService.getTargetGroups(),
  });
}
