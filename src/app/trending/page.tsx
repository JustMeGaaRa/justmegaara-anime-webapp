import TopBar from '@/components/TopBar';
import TrendingAll from '@/components/TrendingAll';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import { mapMALAnime, mapListStatus } from '@/lib/mal/mapper';
import { cookies } from 'next/headers';

const ANIME_FIELDS = [
  'id',
  'title',
  'main_picture',
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

export default async function TrendingPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  let userInfo = null;
  let trendingData = [];

  try {
    const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

    const promises: [Promise<any>, Promise<any>] = [
      mal.anime.getRanking({
        ranking_type: 'all',
        limit: 50,
        fields: ANIME_FIELDS,
      }),
      accessToken ? mal.user.getMyInfo('id,name,picture') : Promise.resolve(null),
    ];

    const [rankingResponse, user] = await Promise.all(promises);

    trendingData = rankingResponse.data.map((item: any) => ({
      anime: mapMALAnime(item.node),
      listKey: item.node.list_status ? mapListStatus(item.node.list_status.status) : null,
      watchedEps: item.node.list_status?.num_episodes_watched ?? 0,
    }));
    userInfo = user;
  } catch (err) {
    console.error('[Trending] Failed to fetch data:', err);
  }

  return (
    <>
      <TopBar userInfo={userInfo} />
      <TrendingAll initialData={trendingData} />
      <Toast />
    </>
  );
}
