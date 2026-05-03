// Re-export everything so callers can import directly from '@/lib/mal'
export * from './types';
export * from './auth';
export { MALClient, MALError } from './client';
export type { MALClientConfig } from './client';
export { AnimeService } from './services/anime';
export type {
  SearchAnimeParams,
  GetAnimeRankingParams,
  GetSeasonalAnimeParams,
  GetSuggestedAnimeParams,
} from './services/anime';
export { MangaService } from './services/manga';
export type { SearchMangaParams, GetMangaRankingParams } from './services/manga';
export { UserService } from './services/user';
export type { GetAnimeListParams, GetMangaListParams } from './services/user';
export { ForumService } from './services/forum';
export type { GetForumTopicsParams, GetTopicDetailsParams } from './services/forum';

import { MALClient } from './client';
import type { MALClientConfig } from './client';
import { AnimeService } from './services/anime';
import { MangaService } from './services/manga';
import { UserService } from './services/user';
import { ForumService } from './services/forum';

/**
 * Top-level façade — the recommended entry point.
 *
 * @example — client-ID only (public data)
 * ```ts
 * const mal = new MAL({ clientId: process.env.MAL_CLIENT_ID });
 * const results = await mal.anime.search({ q: 'Cowboy Bebop' });
 * ```
 *
 * @example — OAuth2 Bearer token (user data)
 * ```ts
 * const mal = new MAL({ accessToken: session.accessToken });
 * const list = await mal.user.getAnimeList('@me', { status: 'watching' });
 * ```
 */
export class MAL {
  readonly anime: AnimeService;
  readonly manga: MangaService;
  readonly user: UserService;
  readonly forum: ForumService;

  constructor(config: MALClientConfig) {
    const client = new MALClient(config);
    this.anime = new AnimeService(client);
    this.manga = new MangaService(client);
    this.user = new UserService(client);
    this.forum = new ForumService(client);
  }
}
