export interface MasterDataItem {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  labelTh: string;
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
