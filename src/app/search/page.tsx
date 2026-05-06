import TopBar from '@/components/layout/TopBar';
import SearchResults from '@/components/SearchResults';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import { mapMALAnime, mapListStatus } from '@/lib/mapper';
import { cookies } from 'next/headers';
import type { PaginatedResponse, Anime as MALAnime, User } from '@/lib/mal/types';
import type { ListKey, Anime } from '@/lib/types';

interface SearchItem {
  anime: Anime;
  listKey: ListKey | null;
  watchedEps: number;
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
  'my_list_status',
].join(',');

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  let userInfo: User | null = null;
  let searchData: SearchItem[] = [];

  if (query) {
    try {
      const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

      const promises: [Promise<PaginatedResponse<{ node: MALAnime }>>, Promise<User | null>] = [
        mal.anime.search({
          q: query,
          limit: 50,
          fields: ANIME_FIELDS,
        }),
        accessToken ? mal.user.getMyInfo('id,name,picture') : Promise.resolve(null),
      ];

      const [searchResponse, user] = await Promise.all(promises);

      searchData = searchResponse.data.map((item) => ({
        anime: mapMALAnime(item.node),
        listKey: item.node.my_list_status ? mapListStatus(item.node.my_list_status.status) : null,
        watchedEps: item.node.my_list_status?.num_episodes_watched ?? 0,
      }));
      userInfo = user;
    } catch (err) {
      console.error('[Search] Failed to fetch data:', err);
    }
  }

  return (
    <>
      <TopBar userInfo={userInfo} />
      <SearchResults key={query} query={query || ''} initialData={searchData} />
      <Toast />
    </>
  );
}
