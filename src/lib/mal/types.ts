// ── Shared primitives ──────────────────────────────────────────────────────────

export interface Picture {
  medium: string;
  large: string;
}

export interface AlternativeTitles {
  synonyms?: string[];
  en?: string;
  ja?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Studio {
  id: number;
  name: string;
}

export interface StartSeason {
  year: number;
  season: AnimeSeason;
}

export interface Broadcast {
  day_of_the_week: string;
  start_time: string;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Author {
  node: Person;
  role: string;
}

export interface Magazine {
  id: number;
  name: string;
}

export interface Serialization {
  node: Magazine;
  role: string;
}

// ── Anime ──────────────────────────────────────────────────────────────────────

export interface AnimeNode {
  id: number;
  title: string;
  main_picture?: Picture;
}

export interface RelatedAnime {
  node: AnimeNode;
  relation_type: string;
  relation_type_formatted: string;
}

export interface RelatedManga {
  node: MangaNode;
  relation_type: string;
  relation_type_formatted: string;
}

export interface RecommendedAnime {
  node: AnimeNode;
  num_recommendations: number;
}

export interface AnimeStatisticsStatus {
  watching: string;
  completed: string;
  on_hold: string;
  dropped: string;
  plan_to_watch: string;
}

export interface AnimeStatistics {
  status: AnimeStatisticsStatus;
  num_list_users: number;
}

export interface AnimeListStatus {
  status?: AnimeStatus;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: string;
  priority?: number;
  num_times_rewatched?: number;
  rewatch_value?: number;
  tags?: string[];
  comments?: string;
  start_date?: string;
  finish_date?: string;
}

export interface Anime extends AnimeNode {
  alternative_titles?: AlternativeTitles;
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: string;
  created_at?: string;
  updated_at?: string;
  media_type?: string;
  status?: string;
  genres?: Genre[];
  my_list_status?: AnimeListStatus;
  num_episodes?: number;
  start_season?: StartSeason;
  broadcast?: Broadcast;
  source?: string;
  average_episode_duration?: number;
  rating?: string;
  pictures?: Picture[];
  background?: string;
  related_anime?: RelatedAnime[];
  related_manga?: RelatedManga[];
  recommendations?: RecommendedAnime[];
  studios?: Studio[];
  statistics?: AnimeStatistics;
}

export interface UpdateAnimeListStatusParams {
  status?: AnimeStatus;
  is_rewatching?: boolean;
  score?: number;
  num_watched_episodes?: number;
  priority?: number;
  num_times_rewatched?: number;
  rewatch_value?: number;
  tags?: string;
  comments?: string;
  start_date?: string;
  finish_date?: string;
}

// ── Manga ──────────────────────────────────────────────────────────────────────

export interface MangaNode {
  id: number;
  title: string;
  main_picture?: Picture;
}

export interface RecommendedManga {
  node: MangaNode;
  num_recommendations: number;
}

export interface MangaListStatus {
  status?: MangaStatus;
  is_rereading: boolean;
  num_volumes_read: number;
  num_chapters_read: number;
  score: number;
  updated_at: string;
  priority?: number;
  num_times_reread?: number;
  reread_value?: number;
  tags?: string[];
  comments?: string;
  start_date?: string;
  finish_date?: string;
}

export interface Manga extends MangaNode {
  alternative_titles?: AlternativeTitles;
  start_date?: string;
  synopsis?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: string;
  created_at?: string;
  updated_at?: string;
  media_type?: string;
  status?: string;
  genres?: Genre[];
  my_list_status?: MangaListStatus;
  num_volumes?: number;
  num_chapters?: number;
  authors?: Author[];
  pictures?: Picture[];
  background?: string;
  related_anime?: RelatedAnime[];
  related_manga?: RelatedManga[];
  recommendations?: RecommendedManga[];
  serialization?: Serialization[];
}

export interface UpdateMangaListStatusParams {
  status?: MangaStatus;
  is_rereading?: boolean;
  score?: number;
  num_volumes_read?: number;
  num_chapters_read?: number;
  priority?: number;
  num_times_reread?: number;
  reread_value?: number;
  tags?: string;
  comments?: string;
  start_date?: string;
  finish_date?: string;
}

// ── User ───────────────────────────────────────────────────────────────────────

export interface UserAnimeStatistics {
  num_items_watching: number;
  num_items_completed: number;
  num_items_on_hold: number;
  num_items_dropped: number;
  num_items_plan_to_watch: number;
  num_items: number;
  num_days_watched: number;
  num_days_watching: number;
  num_days_completed: number;
  num_days_on_hold: number;
  num_days_dropped: number;
  num_days: number;
  num_episodes: number;
  num_times_rewatched: number;
  mean_score: number;
}

export interface User {
  id: number;
  name: string;
  picture?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  joined_at?: string;
  anime_statistics?: UserAnimeStatistics;
  time_zone?: string;
  is_supporter?: boolean;
}

// ── Forum ──────────────────────────────────────────────────────────────────────

export interface ForumSubboard {
  id: number;
  title: string;
}

export interface ForumBoard {
  id: number;
  title: string;
  description: string;
  subboards: ForumSubboard[];
}

export interface ForumCategory {
  title: string;
  boards: ForumBoard[];
}

export interface ForumBoards {
  categories: ForumCategory[];
}

export interface ForumTopicAuthor {
  id: number;
  name: string;
  forum_avator?: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  created_at: string;
  created_by: ForumTopicAuthor;
  number_of_posts: number;
  last_post_created_at: string;
  last_post_created_by: ForumTopicAuthor;
  is_locked: boolean;
}

export interface ForumPost {
  id: number;
  number: number;
  created_at: string;
  created_by: ForumTopicAuthor;
  body: string;
  signature: string;
}

export interface ForumPollOption {
  id: number;
  text: string;
  votes: number;
}

export interface ForumPoll {
  id: number;
  question: string;
  closed: boolean;
  options: ForumPollOption[];
}

export interface ForumTopicDetails {
  data: {
    id: number;
    title: string;
    posts: ForumPost[];
    poll?: ForumPoll;
  };
  paging: Paging;
}

// ── Pagination ─────────────────────────────────────────────────────────────────

export interface Paging {
  previous?: string;
  next?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  paging: Paging;
}

export interface RankedItem<T> {
  node: T;
  ranking: { rank: number };
}

// ── Enums / union types ────────────────────────────────────────────────────────

export type AnimeStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';

export type MangaStatus = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export type AnimeRankingType =
  | 'all'
  | 'airing'
  | 'upcoming'
  | 'tv'
  | 'ova'
  | 'movie'
  | 'special'
  | 'bypopularity'
  | 'favorite';

export type MangaRankingType =
  | 'all'
  | 'manga'
  | 'novels'
  | 'oneshots'
  | 'doujin'
  | 'manhwa'
  | 'manhua'
  | 'bypopularity'
  | 'favorite';

export type AnimeSeason = 'winter' | 'spring' | 'summer' | 'fall';

export type SortAnimeList =
  | 'list_score'
  | 'list_updated_at'
  | 'anime_title'
  | 'anime_start_date'
  | 'anime_id';

export type SortMangaList =
  | 'list_score'
  | 'list_updated_at'
  | 'manga_title'
  | 'manga_start_date';

export type SortSeasonalAnime = 'anime_score' | 'anime_num_list_users';

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface MALToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
