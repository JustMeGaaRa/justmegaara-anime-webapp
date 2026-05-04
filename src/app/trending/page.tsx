import TopBar from '@/components/TopBar';
import TrendingAll from '@/components/TrendingAll';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import type { AnimeRankingType } from '@/lib/mal/types';
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
  'my_list_status',
].join(',');

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type = 'all' } = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  let userInfo = null;
  let trendingData = [];

  const rankingType = (type || 'all') as AnimeRankingType;

  try {
    const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

    const promises: [Promise<any>, Promise<any>] = [
      mal.anime.getRanking({
        ranking_type: rankingType,
        limit: 50,
        fields: ANIME_FIELDS,
      }),
      accessToken ? mal.user.getMyInfo('id,name,picture') : Promise.resolve(null),
    ];

    const [rankingResponse, user] = await Promise.all(promises);

    trendingData = rankingResponse.data.map((item: any) => ({
      anime: mapMALAnime(item.node),
      listKey: item.node.my_list_status ? mapListStatus(item.node.my_list_status.status) : null,
      watchedEps: item.node.my_list_status?.num_episodes_watched ?? 0,
    }));
    userInfo = user;
  } catch (err) {
    console.error('[Trending] Failed to fetch data:', err);
  }

  return (
    <>
      <TopBar userInfo={userInfo} />
      <TrendingAll initialData={trendingData} currentType={rankingType} />
      <Toast />
    </>
  );
}
