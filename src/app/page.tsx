import TopBar from '@/components/layout/TopBar';
import Dashboard from '@/components/Dashboard';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import type { User } from '@/lib/mal';
import { mapMALAnime, mapListStatus } from '@/lib/mapper';
import type { Anime, ListKey } from '@/lib/types';

export interface MALListItem {
  anime: Anime;
  listKey: ListKey;
  watchedEps: number;
  updatedAt: string;
}

export interface MALProfileData {
  user: User;
  animeList: MALListItem[];
}

const ANIME_FIELDS = [
  'id',
  'title',
  'main_picture',
  'alternative_titles',
  'synopsis',
  'mean',
  'rank',
  'num_list_users',
  'genres',
  'studios',
  'media_type',
  'status',
  'start_season',
  'average_episode_duration',
  'rating',
  'num_episodes',
  'source',
  'list_status',
].join(',');

import { cookies } from 'next/headers';

async function fetchMALProfile(): Promise<MALProfileData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  if (!accessToken) return null;

  try {
    const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

    const [user, listResponse] = await Promise.all([
      mal.user.getMyInfo('id,name,picture,anime_statistics'),
      mal.user.getAnimeList('@me', {
        limit: 1000,
        fields: ANIME_FIELDS,
        sort: 'list_updated_at',
      }),
    ]);

    const animeList: MALListItem[] = listResponse.data.map(({ node, list_status }) => ({
      anime: mapMALAnime(node),
      listKey: mapListStatus(list_status?.status),
      watchedEps: list_status?.num_episodes_watched ?? 0,
      updatedAt: list_status?.updated_at ?? new Date().toISOString(),
    }));

    return { user, animeList };
  } catch (err) {
    console.error('[MAL] Failed to fetch profile data:', err);
    return null;
  }
}

export default async function Home() {
  const malData = await fetchMALProfile();

  return (
    <>
      <TopBar userInfo={malData?.user ?? null} />
      <Dashboard malData={malData} />
      <Toast />
    </>
  );
}
