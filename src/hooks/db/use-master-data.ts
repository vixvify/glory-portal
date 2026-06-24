import { useQuery } from "@tanstack/react-query";
import { masterDataService } from "@/infra/container";
import { Category } from "@/core/domain/master-data";
import { CrewRole } from "@/core/domain/crew";

export function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => masterDataService.getCategories(),
  });
}

export function useUniversitiesQuery() {
  return useQuery<string[], Error>({
    queryKey: ["universities"],
    queryFn: () => masterDataService.getUniversities(),
  });
}

export function useSchoolsQuery() {
  return useQuery<string[], Error>({
    queryKey: ["schools"],
    queryFn: () => masterDataService.getSchools(),
  });
}

export function useStudiosQuery() {
  return useQuery<string[], Error>({
    queryKey: ["studios"],
    queryFn: () => masterDataService.getStudios(),
  });
}

export function useCrewRolesQuery() {
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

