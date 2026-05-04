'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';
import type { Anime, ListKey } from '@/lib/types';
import { updateAnimeStatus, deleteAnimeFromList } from '@/app/actions';
import { unmapListStatus } from '@/lib/mapper';

interface SearchItem {
  anime: Anime;
  listKey: ListKey | null;
  watchedEps: number;
}

interface SearchResultsProps {
  query: string;
  initialData: SearchItem[];
}

export default function SearchResults({ query, initialData }: SearchResultsProps) {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [localData, setLocalData] = useState<SearchItem[]>(initialData);

  const handleSetList = async (id: string, key: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: key as ListKey } : item,
      ),
    );
    setListFor(id, key);

    try {
      await updateAnimeStatus(Number(id), unmapListStatus(key as ListKey));
    } catch (err) {
      console.error('[SearchResults] Failed to update MAL status:', err);
    }
  };

  const handleRemove = async (id: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: null, watchedEps: 0 } : item,
      ),
    );
    removeFrom(id);

    try {
      await deleteAnimeFromList(Number(id));
    } catch (err) {
      console.error('[SearchResults] Failed to remove from MAL:', err);
    }
  };

  return (
    <main className="page">
      <div className="ta-head">
        <div>
          <h1 className="ta-title">Search results</h1>
          <p className="ta-sub">
            Found {localData.length} titles for &ldquo;{query}&rdquo;
          </p>
        </div>
      </div>

      <Link href="/" className="ghost-btn" style={{ marginBottom: 24, display: 'inline-flex' }}>
        <span>←</span> Back to dashboard
      </Link>

      {localData.length > 0 ? (
        <div className="grid">
          {localData.map((item) => (
            <AnimeCard
              key={item.anime.id}
              anime={item.anime}
              currentList={item.listKey ?? lists[item.anime.id] ?? null}
              watchedEps={item.watchedEps || (watchedEps[item.anime.id] ?? 0)}
              onSetList={(k) => handleSetList(item.anime.id, k)}
              onRemove={() => handleRemove(item.anime.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-mark">?</div>
          <div className="empty-title">No results found</div>
          <div className="empty-sub">Try searching for something else, like &ldquo;Cowboy Bebop&rdquo; or &ldquo;Frieren&rdquo;</div>
        </div>
      )}
    </main>
  );
}
