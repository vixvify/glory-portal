import { Rating } from "./rating";
import { User } from "./user";
import { CrewRole, CrewMember } from "./crew";

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface University {
  id: string;
  name: string;
  createdAt: Date;
}

export interface AgeRating {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Language {
  id: string;
  name: string;
  createdAt: Date;
}

export interface TargetGroup {
  id: string;
  name: string;
  createdAt: Date;
}

export interface MovieCrew {
  id: string;
  movieId: string;
  crewMemberId: string;
  roleId: string;
  role: string;
  crewRole?: CrewRole;
  crewMember?: CrewMember;
  movie?: Movie;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  category: Category;
  thumbnail: string;
  youtubeUrl: string;
  trailerUrl?: string | null;
  views: number;
  ratings: Rating[];
  year: number;
  matchRate: number;
  aspectRatio: string;
  ageRating: AgeRating;
  duration: number;
  university?: University | null;
  language?: Language | null;
  targetGroup?: TargetGroup | null;
  hasProfanity: boolean;
  hasDrugs: boolean;
  colorType: string;
  studio?: string | null;
  crew: MovieCrew[];
  btsVideos: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  creator?: User | null;
}

export interface MovieCrewInputItem {
  crewMemberId?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface CreateMovie {
  title: string;
  description: string;
  categoryId: string;
  thumbnail: File | null;
  youtubeUrl: string;
  trailerUrl?: string;
  year: number;
  matchRate?: number;
  aspectRatio: string;
  ageRatingId: string;
  duration: number;
  universityId?: string;
  languageId?: string;
  targetGroupId?: string;
  director?: MovieCrewInputItem[];
  producer?: MovieCrewInputItem[];
  writer?: MovieCrewInputItem[];
  cast?: MovieCrewInputItem[];
  dop?: MovieCrewInputItem[];
  editor?: MovieCrewInputItem[];
  btsVideo?: string[];
  hasProfanity?: boolean;
  hasDrugs?: boolean;
  colorType: string;
  studio?: string;
}

export interface UpdateMovie {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  thumbnail: File | string;
  youtubeUrl: string;
  trailerUrl?: string | null;
  year: number;
  matchRate?: number;
  aspectRatio: string;
  ageRatingId: string;
  duration: number;
  universityId?: string | null;
  languageId?: string | null;
  targetGroupId?: string | null;
  director?: MovieCrewInputItem[] | null;
  producer?: MovieCrewInputItem[] | null;
  writer?: MovieCrewInputItem[] | null;
  cast?: MovieCrewInputItem[] | null;
  dop?: MovieCrewInputItem[] | null;
  editor?: MovieCrewInputItem[] | null;
  btsVideo?: string[] | null;
  hasProfanity?: boolean;
  hasDrugs?: boolean;
  colorType: string;
  studio?: string | null;
}

export interface MovieFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagesize?: number | string;
  sort?: string;
  sortby?: string;
}
