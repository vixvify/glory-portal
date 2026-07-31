import { CrewMember } from "@/core/domain/crew";
import { MovieCrew } from "@/core/domain/movie";

/**
 * Determines if a given movie crew role indicates an actor.
 */
export const isActorRole = (movieCrew: MovieCrew): boolean => {
  return (
    movieCrew.crewRole?.category === "cast" ||
    (movieCrew.crewRole?.labelTh || "").includes("นักแสดง") ||
    (typeof movieCrew.role === "string" && movieCrew.role.includes("นักแสดง"))
  );
};

/**
 * Splits a list of crew members into actors and staff based on their movie roles.
 * - An actor is anyone who has at least one movie role as an actor.
 * - Staff is anyone who has at least one movie role that is NOT an actor.
 */
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
