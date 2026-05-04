'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';
import type { Anime, ListKey } from '@/lib/types';
import { updateAnimeStatus, deleteAnimeFromList } from '@/app/actions';
import { unmapListStatus } from '@/lib/mapper';

interface TrendingItem {
  anime: Anime;
  listKey: ListKey | null;
  watchedEps: number;
}

interface TrendingAllProps {
  initialData: TrendingItem[];
  currentType: string;
}

const TRENDING_TYPES = [
  { id: 'all', label: 'Top Anime', sub: 'Highest rated anime series of all time' },
  { id: 'bypopularity', label: 'Most Popular', sub: 'Most added to users lists' },
  { id: 'favorite', label: 'Most Favorited', sub: 'Anime with the most user favorites' },
  { id: 'airing', label: 'Top Airing', sub: 'Highest rated currently airing shows' },
  { id: 'upcoming', label: 'Top Upcoming', sub: 'Most anticipated future releases' },
];

export default function TrendingAll({ initialData, currentType }: TrendingAllProps) {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [localData, setLocalData] = useState<TrendingItem[]>(initialData);
  const [count, setCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = localData.length;

  const currentInfo = TRENDING_TYPES.find((t) => t.id === currentType) || TRENDING_TYPES[0];


  const handleSetList = async (id: string, key: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: key as ListKey } : item,
      ),
    );
    const item = localData.find((it) => it.anime.id === id);
    setListFor(id, key, item?.anime.title);

    try {
      await updateAnimeStatus(Number(id), unmapListStatus(key as ListKey));
    } catch (err) {
      console.error('[TrendingAll] Failed to update MAL status:', err);
    }
  };

  const handleRemove = async (id: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: null, watchedEps: 0 } : item,
      ),
    );
    const item = localData.find((it) => it.anime.id === id);
    removeFrom(id, item?.anime.title);

    try {
      await deleteAnimeFromList(Number(id));
    } catch (err) {
      console.error('[TrendingAll] Failed to remove from MAL:', err);
    }
  };

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(total, c + 8));
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [total]);

  const items = localData.slice(0, count);

  return (
    <main className="page">
      <div className="ta-head">
        <div>
          <h1 className="ta-title">{currentInfo.label}</h1>
          <p className="ta-sub">
            {currentInfo.sub} · Showing {items.length} of {total}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div className="filters" style={{ marginBottom: 0 }}>
          {TRENDING_TYPES.map((type) => (
            <Link
              key={type.id}
              href={`/trending?type=${type.id}`}
              className={`filter-chip ${currentType === type.id ? 'is-active' : ''}`}
              scroll={false}
            >
              {type.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="ta-list">
        {items.map((item, i) => (
          <div className="ta-row" key={item.anime.id}>
            <div className="ta-rank">{String(i + 1).padStart(2, '0')}</div>
            <AnimeCard
              anime={item.anime}
              currentList={item.listKey ?? lists[item.anime.id] ?? null}
              watchedEps={item.watchedEps || (watchedEps[item.anime.id] ?? 0)}
              onSetList={(k) => handleSetList(item.anime.id, k)}
              onRemove={() => handleRemove(item.anime.id)}
              showListStatus={true}
            />
          </div>
        ))}
        {count < total && (
          <div className="ta-sentinel" ref={sentinelRef}>
            <div className="ta-spinner"></div>
            Loading more…
          </div>
        )}
        {count >= total && total > 0 && <div className="ta-end">You&apos;ve reached the end.</div>}
        {total === 0 && <div className="ta-end">No data available at the moment.</div>}
      </div>
    </main>
  );
}
