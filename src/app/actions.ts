'use server';

import { cookies } from 'next/headers';
import { MAL } from '@/lib/mal';
import type { AnimeStatus } from '@/lib/mal/types';
import { revalidatePath } from 'next/cache';

export async function updateAnimeStatus(animeId: number, status: AnimeStatus) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const mal = new MAL({ accessToken });
  
  try {
    const result = await mal.anime.updateMyListStatus(animeId, { status });
    revalidatePath('/');
    revalidatePath('/trending');
    revalidatePath(`/anime/${animeId}`);
    return result;
  } catch (error) {
    console.error(`[MAL Action] Failed to update status for anime ${animeId}:`, error);
    throw error;
  }
}

export async function deleteAnimeFromList(animeId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mal_access_token')?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const mal = new MAL({ accessToken });

  try {
    await mal.anime.deleteFromMyList(animeId);
    revalidatePath('/');
    revalidatePath('/trending');
    revalidatePath(`/anime/${animeId}`);
  } catch (error) {
    console.error(`[MAL Action] Failed to delete anime ${animeId} from list:`, error);
    throw error;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('mal_access_token');
  cookieStore.delete('mal_refresh_token');
  revalidatePath('/');
}
