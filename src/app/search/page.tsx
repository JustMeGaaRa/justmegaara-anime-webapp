import TopBar from '@/components/TopBar';
import SearchResults from '@/components/SearchResults';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import { mapMALAnime, mapListStatus } from '@/lib/mapper';
import { cookies } from 'next/headers';

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

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: query } = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  let userInfo = null;
  let searchData = [];

  if (query) {
    try {
      const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

      const promises: [Promise<any>, Promise<any>] = [
        mal.anime.search({
          q: query,
          limit: 50,
          fields: ANIME_FIELDS,
        }),
        accessToken ? mal.user.getMyInfo('id,name,picture') : Promise.resolve(null),
      ];

      const [searchResponse, user] = await Promise.all(promises);

      searchData = searchResponse.data.map((item: any) => ({
        anime: mapMALAnime(item.node),
        listKey: item.node.list_status ? mapListStatus(item.node.list_status.status) : null,
        watchedEps: item.node.list_status?.num_episodes_watched ?? 0,
      }));
      userInfo = user;
    } catch (err) {
      console.error('[Search] Failed to fetch data:', err);
    }
  }

  return (
    <>
      <TopBar userInfo={userInfo} />
      <SearchResults query={query || ''} initialData={searchData} />
      <Toast />
    </>
  );
}
