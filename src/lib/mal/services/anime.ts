import type { MALClient } from '../client';
import type {
  Anime,
  AnimeNode,
  AnimeListStatus,
  AnimeRankingType,
  AnimeSeason,
  SortSeasonalAnime,
  PaginatedResponse,
  RankedItem,
  UpdateAnimeListStatusParams,
} from '../types';

export interface SearchAnimeParams {
  q: string;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export interface GetAnimeRankingParams {
  ranking_type: AnimeRankingType;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export interface GetSeasonalAnimeParams {
  year: number;
  season: AnimeSeason;
  sort?: SortSeasonalAnime;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export interface GetSuggestedAnimeParams {
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export class AnimeService {
  constructor(private readonly client: MALClient) {}

  /** Search anime by title. */
  search(params: SearchAnimeParams): Promise<PaginatedResponse<{ node: AnimeNode }>> {
    return this.client.get('/anime', params);
  }

  /** Get full details for a single anime by ID. */
  getById(id: number, fields?: string): Promise<Anime> {
    return this.client.get(`/anime/${id}`, fields ? { fields } : undefined);
  }

  /** Get anime by ranking category. */
  getRanking(
    params: GetAnimeRankingParams,
  ): Promise<PaginatedResponse<RankedItem<AnimeNode>>> {
    return this.client.get('/anime/ranking', params);
  }

  /** Get the anime airing in a specific season. */
  getSeasonal(
    params: GetSeasonalAnimeParams,
  ): Promise<PaginatedResponse<{ node: AnimeNode }>> {
    const { year, season, ...rest } = params;
    return this.client.get(`/anime/season/${year}/${season}`, rest);
  }

  /** Get personalized anime suggestions for the authenticated user. */
  getSuggestions(
    params?: GetSuggestedAnimeParams,
  ): Promise<PaginatedResponse<{ node: AnimeNode }>> {
    return this.client.get('/anime/suggestions', params);
  }

  /** Add or update an anime entry on the authenticated user's list. */
  updateMyListStatus(
    animeId: number,
    params: UpdateAnimeListStatusParams,
  ): Promise<AnimeListStatus> {
    return this.client.patch(`/anime/${animeId}/my_list_status`, params);
  }

  /** Remove an anime from the authenticated user's list. */
  deleteFromMyList(animeId: number): Promise<void> {
    return this.client.delete(`/anime/${animeId}/my_list_status`);
  }
}
