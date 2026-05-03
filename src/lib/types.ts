export type ListKey = 'watching' | 'planned' | 'completed' | 'on-hold' | 'dropped';

export interface AnimeSeason {
  n: number;
  year: number;
  episodes: number;
  isCurrent: boolean;
}

export interface Anime {
  id: string;
  title: string;
  poster: string;
  palette: [string, string, string];
  season: string;
  status: 'Currently Airing' | 'Finished' | 'Upcoming';
  score: number;
  userCount: number;
  rank: number;
  ageRating: string;
  episodes: number;
  genres: [string, string];
  studio: string;
  source: string;
  duration: number;
  year: number;
  synopsis: string;
  seasons: AnimeSeason[];
  relatedIds: string[];
}

export type Lists = Record<string, ListKey>;
export type WatchedEps = Record<string, number>;
