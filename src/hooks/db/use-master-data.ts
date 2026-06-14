import { useQuery } from "@tanstack/react-query";
import { masterDataService } from "@/infra/container";
import { Category } from "@/core/domain/movie";
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

export function useCrewRolesQuery() {
  return useQuery<CrewRole[], Error>({
    queryKey: ["crew-roles"],
    queryFn: () => masterDataService.getCrewRoles(),
  });
}

