import { Rating } from "./rating";
import { User } from "./user";
import { CrewRole, CrewMember } from "./crew";
import { Category } from "./master-data";

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
  categories: Category[];
  thumbnail: string;
  youtubeUrl: string;
  trailerUrl?: string | null;
  views: number;
  ratings: Rating[];
  releaseDate: string | Date;
  matchRate: number;
  averageRating: number;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string | null;
  school?: string | null;
  language?: string | null;
  awards: string[];
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

export interface BtsVideoItem {
  id: string;
  movie: Movie;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
}

export interface MovieCrewInputItem {
  crewMemberId?: string | null;
  name?: string | null;
  email?: string | null;
}

export interface MovieCrewInputItemWithRole extends MovieCrewInputItem {
  role: string;
}

export interface CreateMovie {
  title: string;
  description: string;
  categoryIds: string[];
  thumbnail: File | null;
  youtubeUrl: string;
  trailerUrl?: string | null;
  releaseDate: string;
  matchRate?: number;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string | null;
  school?: string | null;
  language?: string | null;
  crew?: MovieCrewInputItemWithRole[] | null;
  btsVideo?: string[] | null;
  hasProfanity?: boolean;
  hasDrugs?: boolean;
  colorType: string;
  studio?: string | null;
  awards?: string[];
}

export interface UpdateMovie {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  thumbnail: File | string;
  youtubeUrl: string;
  trailerUrl?: string | null;
  releaseDate: string;
  matchRate?: number;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string | null;
  school?: string | null;
  language?: string | null;
  crew?: MovieCrewInputItemWithRole[] | null;
  btsVideo?: string[] | null;
  hasProfanity?: boolean;
  hasDrugs?: boolean;
  colorType: string;
  studio?: string | null;
  awards?: string[];
}

export interface MovieFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagesize?: number | string;
  sort?: string;
  sortby?: string;
  aspectRatio?: string;
}

export interface MovieFormProps {
  editingMovie?: Movie | null;
  categories: Category[];
  universities: string[];
  crewRoles: CrewRole[];
  availableCrew: CrewMember[];
}

export type AffiliationType = "university" | "school" | "studio";

export type MovieFormInputs = {
  title: string;
  description: string;
  categoryIds: string[];
  thumbnail?: File | null;
  youtubeUrl: string;
  trailerUrl?: string;
  releaseDate: string;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string;
  school?: string;
  language?: string;
  hasProfanity: boolean;
  hasDrugs: boolean;
  colorType: string;
  studio?: string;
  crew?: MovieCrewInputItemWithRole[];
  btsVideo?: string[];
  awards?: string[];
};
