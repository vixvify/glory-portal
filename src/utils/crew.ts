import { CrewMember } from "@/core/domain/crew";
import { MovieCrew } from "@/core/domain/movie";


export const isActorRole = (movieCrew: MovieCrew): boolean => {
  return (
    movieCrew.crewRole?.category === "cast" ||
    (movieCrew.crewRole?.labelTh || "").includes("นักแสดง") ||
    (typeof movieCrew.role === "string" && movieCrew.role.includes("นักแสดง"))
  );
};


export const splitCrewByRole = (
  allCrewMembers: CrewMember[],
): { actorList: CrewMember[]; staffList: CrewMember[] } => {
  const actorList = allCrewMembers.filter((member) =>
    member.movies?.some(isActorRole),
  );

  const staffList = allCrewMembers.filter((member) =>
    member.movies?.some((m) => !isActorRole(m)),
  );

  return { actorList, staffList };
};
