import { useQuery } from "@tanstack/react-query";
import { masterDataService } from "@/infra/container";
import { Category, MasterDataItem } from "@/core/domain/master-data";
import { CrewRole } from "@/core/domain/crew";

export function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => masterDataService.getCategories(),
  });
}

export function useUniversitiesQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["universities"],
    queryFn: () => masterDataService.getUniversities(),
  });
}

export function useSchoolsQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["schools"],
    queryFn: () => masterDataService.getSchools(),
  });
}

export function useLanguagesQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["languages"],
    queryFn: () => masterDataService.getLanguages(),
  });
}

export function useSubtitlesQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["subtitles"],
    queryFn: () => masterDataService.getSubtitles(),
  });
}

export function useColorTypesQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["color-types"],
    queryFn: () => masterDataService.getColorTypes(),
  });
}

export function useContentWarningsQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["content-warnings"],
    queryFn: () => masterDataService.getContentWarnings(),
  });
}

export function useAgeRatingsQuery() {
  return useQuery<MasterDataItem[], Error>({
    queryKey: ["age-ratings"],
    queryFn: () => masterDataService.getAgeRatings(),
  });
}export function useCrewRolesQuery() {
  return useQuery<CrewRole[], Error>({
    queryKey: ["crew-roles"],
    queryFn: () => masterDataService.getCrewRoles(),
  });
}

export function useMostActiveUniversityQuery() {
  return useQuery<string, Error>({
    queryKey: ["most-active-university"],
    queryFn: () => masterDataService.getMostActiveUniversity(),
  });
}

