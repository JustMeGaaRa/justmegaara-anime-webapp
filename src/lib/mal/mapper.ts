import type { Anime as MALAnime, AnimeStatus } from './types';
import type { Anime, ListKey } from '@/lib/types';

const DEFAULT_PALETTE: [string, string, string] = ['#1a1a2e', '#16213e', '#e2e8f0'];

function mapAiringStatus(status?: string): Anime['status'] {
  if (status === 'currently_airing') return 'Currently Airing';
  if (status === 'not_yet_aired') return 'Upcoming';
  return 'Finished';
}

function mapRating(rating?: string): string {
  if (!rating) return 'PG';
  if (rating === 'g') return 'G';
  if (rating === 'pg_13') return 'PG-13';
  if (rating === 'pg') return 'PG';
  if (rating === 'r+' || rating === 'rx') return 'R+';
  if (rating === 'r') return 'R';
  return 'PG';
}

export function mapMALAnime(mal: MALAnime): Anime {
  const g0 = mal.genres?.[0]?.name ?? '';
  const g1 = mal.genres?.[1]?.name ?? '';

  const season = mal.start_season
    ? `${mal.start_season.season[0].toUpperCase()}${mal.start_season.season.slice(1)} ${mal.start_season.year}`
    : '';

  return {
    id: String(mal.id),
    title: mal.title,
    poster: mal.main_picture?.large ?? mal.main_picture?.medium ?? '',
    palette: DEFAULT_PALETTE,
    season,
    status: mapAiringStatus(mal.status),
    score: mal.mean ?? 0,
    userCount: mal.num_list_users ?? 0,
    rank: mal.rank ?? 0,
    ageRating: mapRating(mal.rating),
    episodes: mal.num_episodes ?? 0,
    genres: [g0, g1],
    studio: mal.studios?.[0]?.name ?? '',
    source: mal.source ?? '',
    duration: mal.average_episode_duration ? Math.round(mal.average_episode_duration / 60) : 0,
    year: mal.start_season?.year ?? 0,
    synopsis: mal.synopsis ?? '',
    seasons: [
      {
        n: 1,
        year: mal.start_season?.year ?? 0,
        episodes: mal.num_episodes ?? 0,
        isCurrent: mal.status === 'currently_airing',
      },
    ],
    relatedIds: [
      ...(mal.related_anime?.map((r) => String(r.node.id)) ?? []),
      ...(mal.recommendations?.map((r) => String(r.node.id)) ?? []),
    ],
  };
}

export function mapListStatus(status?: AnimeStatus): ListKey {
  switch (status) {
    case 'watching': return 'watching';
    case 'completed': return 'completed';
    case 'on_hold': return 'on-hold';
    case 'dropped': return 'dropped';
    case 'plan_to_watch': return 'planned';
    default: return 'planned';
  }
}
