import type { MALClient } from '../client';
import type {
  User,
  Anime,
  Manga,
  AnimeListStatus,
  MangaListStatus,
  AnimeStatus,
  MangaStatus,
  SortAnimeList,
  SortMangaList,
  PaginatedResponse,
} from '../types';

export interface GetAnimeListParams {
  status?: AnimeStatus;
  sort?: SortAnimeList;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export interface GetMangaListParams {
  status?: MangaStatus;
  sort?: SortMangaList;
  limit?: number;
  offset?: number;
  fields?: string;
  nsfw?: boolean;
}

export class UserService {
  constructor(private readonly client: MALClient) {}

  /** Get the authenticated user's profile. */
  getMyInfo(fields?: string): Promise<User> {
    return this.client.get('/users/@me', fields ? { fields } : undefined);
  }

  /** Get a user's anime list. Defaults to the authenticated user (@me). */
  getAnimeList(
    username: string = '@me',
    params?: GetAnimeListParams,
  ): Promise<PaginatedResponse<{ node: Anime; list_status: AnimeListStatus }>> {
    return this.client.get(`/users/${username}/animelist`, params);
  }

  /** Get a user's manga list. Defaults to the authenticated user (@me). */
  getMangaList(
    username: string = '@me',
    params?: GetMangaListParams,
  ): Promise<PaginatedResponse<{ node: Manga; list_status: MangaListStatus }>> {
    return this.client.get(`/users/${username}/mangalist`, params);
  }
}
