'use client';

import React from 'react';
import type { Anime } from '@/lib/types';
import AnimeCard from '../anime/AnimeCard';
import HorizontalScroller from '../HorizontalScroller';

interface RecentlyWatchedSectionProps {
  recentlyWatched: Anime[];
  listsMap: Record<string, string>;
  watchedEpsMap: Record<string, number>;
  handleSetList: (id: string, k: string) => void;
  handleRemove: (id: string) => void;
}

export function RecentlyWatchedSection({
  recentlyWatched,
  listsMap,
  watchedEpsMap,
  handleSetList,
  handleRemove,
}: RecentlyWatchedSectionProps) {
  if (recentlyWatched.length === 0) return null;

  return (
    <section className="section">
      <header className="section-head">
        <div>
          <h2 className="section-title">Recently watched</h2>
          <p className="section-sub">Pick up where you left off</p>
        </div>
      </header>
      <HorizontalScroller>
        {recentlyWatched.map((a) => (
          <div className="row-card" key={a.id}>
            <AnimeCard
              anime={a}
              currentList={listsMap[a.id] ?? null}
              watchedEps={watchedEpsMap[a.id] ?? 0}
              onSetList={(k) => handleSetList(a.id, k)}
              onRemove={() => handleRemove(a.id)}
            />
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );
}
