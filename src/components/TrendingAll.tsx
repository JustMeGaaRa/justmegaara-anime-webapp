'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ANIME } from '@/lib/data';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';

export default function TrendingAll() {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [count, setCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = ANIME.length;

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

  const items = ANIME.slice(0, count);

  return (
    <main className="page">
      <div className="ta-head">
        <div>
          <h1 className="ta-title">Trending now</h1>
          <p className="ta-sub">
            Top across the community · Showing {items.length} of {total} · Updated 12 minutes ago
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
        {items.map((a, i) => (
          <div className="ta-row" key={a.id}>
            <div className="ta-rank">{String(i + 1).padStart(2, '0')}</div>
            <AnimeCard
              anime={a}
              currentList={lists[a.id] ?? null}
              watchedEps={watchedEps[a.id] ?? 0}
              onSetList={(k) => setListFor(a.id, k)}
              onRemove={() => removeFrom(a.id)}
            />
          </div>
        ))}
        {count < total && (
          <div className="ta-sentinel" ref={sentinelRef}>
            <div className="ta-spinner"></div>
            Loading more…
          </div>
        )}
        {count >= total && <div className="ta-end">You&apos;ve reached the end of trending.</div>}
      </div>
    </main>
  );
}
