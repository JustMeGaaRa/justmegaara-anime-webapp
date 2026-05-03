import type { MALClient } from '../client';
import type {
  Manga,
  MangaNode,
  MangaListStatus,
  MangaRankingType,
  PaginatedResponse,
  RankedItem,
  UpdateMangaListStatusParams,
} from '../types';

export interface SearchMangaParams {
  q: string;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export interface GetMangaRankingParams {
  ranking_type: MangaRankingType;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export class MangaService {
  constructor(private readonly client: MALClient) {}

  /** Search manga by title. */
  search(params: SearchMangaParams): Promise<PaginatedResponse<{ node: MangaNode }>> {
    return this.client.get('/manga', params);
  }

  /** Get full details for a single manga by ID. */
  getById(id: number, fields?: string): Promise<Manga> {
    return this.client.get(`/manga/${id}`, fields ? { fields } : undefined);
  }

  /** Get manga by ranking category. */
  getRanking(
    params: GetMangaRankingParams,
  ): Promise<PaginatedResponse<RankedItem<MangaNode>>> {
    return this.client.get('/manga/ranking', params);
  }

  /** Add or update a manga entry on the authenticated user's list. */
  updateMyListStatus(
    mangaId: number,
    params: UpdateMangaListStatusParams,
  ): Promise<MangaListStatus> {
    return this.client.patch(`/manga/${mangaId}/my_list_status`, params);
  }

  /** Remove a manga from the authenticated user's list. */
  deleteFromMyList(mangaId: number): Promise<void> {
    return this.client.delete(`/manga/${mangaId}/my_list_status`);
  }
}
