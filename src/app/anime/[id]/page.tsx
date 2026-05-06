import TopBar from '@/components/layout/TopBar';
import DetailView from '@/components/DetailView';
import Toast from '@/components/Toast';
import { MAL } from '@/lib/mal';
import { mapMALAnime } from '@/lib/mapper';
import { cookies } from 'next/headers';
import type { Anime, User } from '@/lib/mal/types';

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
  'related_anime',
  'recommendations',
].join(',');

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;
  const clientId = process.env.MAL_CLIENT_ID;

  let userInfo = null;
  let animeData = null;
  try {
    const mal = new MAL(accessToken ? { accessToken } : { clientId: clientId! });

    const promises: [Promise<Anime>, Promise<User | null>] = [
      mal.anime.getById(Number(id), ANIME_FIELDS),
      accessToken ? mal.user.getMyInfo('id,name,picture') : Promise.resolve(null),
    ];

    const [anime, user] = await Promise.all(promises);

    animeData = mapMALAnime(anime);
    userInfo = user;
  } catch (err) {
    console.error(`[Anime Detail] Failed to fetch data for ${id}:`, err);
  }

  return (
    <>
      <TopBar userInfo={userInfo} />
      <DetailView initialAnime={animeData} />
      <Toast />
    </>
  );
}
