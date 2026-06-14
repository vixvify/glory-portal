import { CrewRole, CrewOption, CrewMember } from "@/core/domain/crew";
import {
  CREW_CATEGORIES,
  CrewCategory,
} from "@/core/constants/movie-form";

export function getFilteredCategories(crewRoles: CrewRole[]): CrewCategory[] {
  const dbRoleCodes = new Set(crewRoles.map((r) => r.name.toUpperCase()));
  return CREW_CATEGORIES.map((cat) => {
    const roles = cat.roles.filter((r) =>
      dbRoleCodes.has(r.code.toUpperCase()),
    );
    return { ...cat, roles };
  }).filter((cat) => cat.roles.length > 0);
}

export function getCrewOptions(availableCrew: CrewMember[]): CrewOption[] {
  return availableCrew.map((c) => ({
    id: c.id,
    name: c.name,
    photoUrl: c.user?.photoUrl,
    email: c.email || "",
  }));
}
