import { Rating } from "./rating";
import { User } from "./user";

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

export interface CrewRole {
  id: string;
  name: string;
  createdAt: Date;
}

export interface CrewMember {
  id: string;
  name: string;
  email?: string | null;
  userId?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User | null;
  movies?: MovieCrew[];
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
  director?: string[];
  producer?: string[];
  writer?: string[];
  cast?: string[];
  dop?: string[];
  editor?: string[];
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
  director?: string[] | null;
  producer?: string[] | null;
  writer?: string[] | null;
  cast?: string[] | null;
  dop?: string[] | null;
  editor?: string[] | null;
  btsVideo?: string[] | null;
  hasProfanity?: boolean;
  hasDrugs?: boolean;
  colorType: string;
  studio?: string | null;
}

export interface CreateCrewMember {
  name: string;
  email?: string;
}

export interface UpdateCrewMember {
  id: string;
  name: string;
  email?: string | null;
}

export interface MovieFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagesize?: number | string;
  sort?: string;
  sortby?: string;
}

export interface CrewFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagesize?: number | string;
  sort?: string;
  sortby?: string;
}
