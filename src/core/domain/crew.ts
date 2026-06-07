import { User } from "./user";
import { MovieCrew } from "./movie";

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

export interface CrewStateItem {
  id: string;
  name: string;
  email: string;
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

export interface CrewFilterParams {
  search?: string;
  searchby?: string;
  page?: number | string;
  pagesize?: number | string;
  sort?: string;
  sortby?: string;
}
