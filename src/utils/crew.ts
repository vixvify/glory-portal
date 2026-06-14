import { Movie, MovieCrewInputItemWithRole } from "@/core/domain/movie";
import { CrewStateItem, CrewRole, CrewOption, CrewMember } from "@/core/domain/crew";
import {
  CREW_CATEGORIES,
  FLAT_CREW_ROLES,
  CrewCategory,
  CrewTabId,
} from "@/core/constants/movie-form";

const DEFAULT_CREW_ITEM: CrewStateItem = { id: "", name: "", email: "" };

const INITIAL_CREW_STATE = FLAT_CREW_ROLES.reduce(
  (acc, role) => {
    acc[role.id as CrewTabId] = [{ ...DEFAULT_CREW_ITEM }];
    return acc;
  },
  {} as Record<CrewTabId, CrewStateItem[]>,
);

export const mapCrewToState = (
  crew: Movie["crew"] | undefined,
  role: string,
): CrewStateItem[] => {
  const items =
    crew
      ?.filter((c) => c.role.toLowerCase() === role.toLowerCase())
      .map((c) => ({
        id: c.crewMember?.id || "",
        name: c.crewMember?.name || "",
        email: c.crewMember?.email || "",
      }))
      .filter((x): x is CrewStateItem => !!x.name) || [];
  return items.length > 0 ? items : [{ id: "", name: "", email: "" }];
};

export const mapStateToCrewInput = (list: CrewStateItem[]) => {
  return list
    .filter((item) => item.name.trim() !== "")
    .map((item) => ({
      crewMemberId: item.id || null,
      name: item.id ? null : item.name.trim(),
      email: item.id ? null : item.email?.trim() || null,
    }));
};

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

export function getInitialCrewState(editingMovie: Movie | null): Record<CrewTabId, CrewStateItem[]> {
  if (editingMovie) {
    const state = {} as Record<CrewTabId, CrewStateItem[]>;
    FLAT_CREW_ROLES.forEach((role) => {
      state[role.id as CrewTabId] = mapCrewToState(editingMovie.crew, role.id);
    });
    return state;
  }
  return INITIAL_CREW_STATE;
}

export function transformCrewStateToPayload(
  crewState: Record<CrewTabId, CrewStateItem[]>,
): MovieCrewInputItemWithRole[] {
  return FLAT_CREW_ROLES.flatMap((role) => {
    const list = crewState[role.id as CrewTabId] || [];
    return mapStateToCrewInput(list).map((item) => ({
      role: role.code,
      crewMemberId: item.crewMemberId,
      name: item.name,
      email: item.email,
    }));
  });
}
