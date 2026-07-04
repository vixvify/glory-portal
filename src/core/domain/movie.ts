import { Rating } from "./rating";
import { User } from "./user";
import { CrewRole, CrewMember } from "./crew";
import { Category } from "./master-data";

export enum ContentWarning {
  PROFANITY = 'PROFANITY',
  DRUGS = 'DRUGS',
  VIOLENCE = 'VIOLENCE',
  GORE = 'GORE',
  SEXUAL_CONTENT = 'SEXUAL_CONTENT',
  NUDITY = 'NUDITY',
  SMOKING = 'SMOKING',
  ALCOHOL = 'ALCOHOL',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  FLASHING_LIGHTS = 'FLASHING_LIGHTS',
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
  categories: Category[];
  thumbnail: string;
  youtubeUrl: string;
  trailerUrls?: string[];
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
  subtitle?: string | null;
  awards: Award[];
  contentWarnings: ContentWarning[];
  otherContentWarning?: string | null;
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
  trailerUrls?: string[];
  releaseDate: string;
  matchRate?: number;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string | null;
  school?: string | null;
  language?: string | null;
  subtitle?: string | null;
  crew?: MovieCrewInputItemWithRole[] | null;
  btsVideo?: string[] | null;
  contentWarnings?: ContentWarning[];
  otherContentWarning?: string | null;
  colorType: string;
  studio?: string | null;
  awards?: Award[];
  tags?: string[];
}

export interface UpdateMovie {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  thumbnail: File | string;
  youtubeUrl: string;
  trailerUrls?: string[];
  releaseDate: string;
  matchRate?: number;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string | null;
  school?: string | null;
  language?: string | null;
  subtitle?: string | null;
  crew?: MovieCrewInputItemWithRole[] | null;
  btsVideo?: string[] | null;
  contentWarnings?: ContentWarning[];
  otherContentWarning?: string | null;
  colorType: string;
  studio?: string | null;
  awards?: Award[];
  tags?: string[];
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

export interface Award {
  projectName: string;
  awardList: string[];
}

export interface MovieAwardInputProject {
  projectName: string;
  awardList: { value: string }[];
}

export type MovieFormInputs = {
  title: string;
  description: string;
  categoryIds: string[];
  thumbnail?: File | null;
  youtubeUrl: string;
  trailerUrls?: string[];
  releaseDate: string;
  aspectRatio: string;
  ageRating: string;
  duration: number;
  university?: string;
  school?: string;
  language?: string;
  subtitle?: string;
  contentWarnings: string[];
  otherContentWarning: string;
  colorType: string;
  studio?: string;
  crew?: MovieCrewInputItemWithRole[];
  btsVideo?: string[];
  awards?: MovieAwardInputProject[];
  tags?: string[];
};

