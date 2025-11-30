export interface Superpower {
  id: string;
  name: string;
  description?: string;
}

export interface Hero {
  id: string;
  name: string;
  heroName: string;
  birthDate: string;
  height?: number;
  weight?: number;
  superpowers: Superpower[];
}

export interface HeroPayload {
  name: string;
  heroName: string;
  birthDate: string;
  height?: number | null;
  weight?: number | null;
  superpowerIds: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}
