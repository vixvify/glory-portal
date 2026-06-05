export interface User {
  name: string;
  email: string;
  photoUrl?: string | null;
  motto?: string | null;
  bio?: string | null;
  ig?: string | null;
  facebook?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  positions?: string[];
  birthday?: string | null;
  awards?: string[];
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  photo?: File;
  motto?: string;
  bio?: string;
  ig?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  positions?: string[];
  birthday?: string;
  awards?: string[];
}

export interface LoginUser {
  email: string;
  password: string;
}
