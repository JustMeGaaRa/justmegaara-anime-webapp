'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';
import type { Anime, ListKey } from '@/lib/types';

interface TrendingItem {
  anime: Anime;
  listKey: ListKey | null;
  watchedEps: number;
}

interface TrendingAllProps {
  initialData: TrendingItem[];
}

export default function TrendingAll({ initialData }: TrendingAllProps) {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [localData, setLocalData] = useState<TrendingItem[]>(initialData);
  const [count, setCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = localData.length;

  const handleSetList = (id: string, key: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: key as ListKey } : item,
      ),
    );
    setListFor(id, key);
  };

  const handleRemove = (id: string) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.anime.id === id ? { ...item, listKey: null, watchedEps: 0 } : item,
      ),
    );
    removeFrom(id);
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
          <h1 className="ta-title">Trending now</h1>
          <p className="ta-sub">
            Top across the community · Showing {items.length} of {total} · Updated just now
          </p>
        </div>
        <div className="ta-sort">
          <span className="ta-sort-label">Sort</span>
          <select className="ta-sort-select" defaultValue="trending">
            <option value="trending">Trending score</option>
            <option value="rank">Ranking</option>
            <option value="score">User score</option>
            <option value="recent">Recently aired</option>
          </select>
        </div>
      </div>

      <Link href="/" className="ghost-btn" style={{ marginBottom: 24, display: 'inline-flex' }}>
        <span>←</span> Back to dashboard
      </Link>

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
            />
          </div>
        ))}
        {count < total && (
          <div className="ta-sentinel" ref={sentinelRef}>
            <div className="ta-spinner"></div>
            Loading more…
          </div>
        )}
        {count >= total && total > 0 && <div className="ta-end">You&apos;ve reached the end of trending.</div>}
        {total === 0 && <div className="ta-end">No trending data available at the moment.</div>}
      </div>
    </main>
  );
}
