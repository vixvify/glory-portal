import { Rating } from "./rating";

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
export interface CrewMember {
  id: string;
  name: string;
  email?: string | null;
  photoUrl?: string | null;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface MovieCrew {
  id: string;
  movieId: string;
  crewMemberId: string;
  role: string;
  crewMember?: CrewMember;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieBts {
  id: string;
  movieId: string;
  btsVideo: string[];
  btsPhotos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  youtubeUrl: string;
  views: number;
  ratings: Rating[];
  year: number;
  matchRate: number;
  ageRating: string;
  duration: number;
  university?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  email?: string | null;
  language?: string | null;
  targetGroup?: string | null;
  crew: MovieCrew[];
  bts?: MovieBts | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovie {
  title: string;
  description: string;
  category: string;
  thumbnail: File | null;
  youtubeUrl: string;
  year: number;
  matchRate: number;
  ageRating: string;
  duration: number;
  university?: string;
  facebook?: string;
  instagram?: string;
  email?: string;
  language?: string;
  targetGroup?: string;
  director?: string | string[];
  producer?: string | string[];
  writer?: string | string[];
  cast?: string | string[];
  btsVideo?: string | string[];
  btsPhotos?: FileList | File[] | string | string[] | null;
}

export interface UpdateMovie {
  title: string;
  description: string;
  category: string;
  thumbnail: File | string;
  youtubeUrl: string;
  year: number;
  matchRate: number;
  ageRating: string;
  duration: number;
  university?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  email?: string | null;
  language?: string | null;
  targetGroup?: string | null;
  director?: string | string[] | null;
  producer?: string | string[] | null;
  writer?: string | string[] | null;
  cast?: string | string[] | null;
  btsVideo?: string | string[] | null;
  btsPhotos?: FileList | File[] | string | string[] | null;
}
export interface CreateCrewMember {
  name: string;
  email?: string;
  photo?: File | null;
}

export interface UpdateCrewMember {
  name: string;
  email?: string | null;
  photo?: File | string | null;
}
export interface MovieFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagenumber?: number | string;
  sort?: string;
  sortby?: string;
}

export interface CrewFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagenumber?: number | string;
  sort?: string;
  sortby?: string;
}
