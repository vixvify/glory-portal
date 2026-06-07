import { Movie } from "@/core/domain/movie";
import { CrewStateItem } from "@/core/domain/crew";

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
