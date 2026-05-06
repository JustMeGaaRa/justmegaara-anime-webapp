'use client';

import React from 'react';
import type { Anime } from '@/lib/types';
import AnimeCard from '../anime/AnimeCard';
import { FILTERS } from '@/lib/data';
import type { MALListItem } from '@/app/page';

interface MyListSectionProps {
  filteredMyList: Anime[];
  malList: MALListItem[] | null;
  lists: Record<string, string>;
  listsMap: Record<string, string>;
  watchedEpsMap: Record<string, number>;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  sortBy: string;
  setSortBy: (s: 'name' | 'release_date' | 'date_added') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (o: 'asc' | 'desc') => void;
  handleSetList: (id: string, k: string) => void;
  handleRemove: (id: string) => void;
}

export function MyListSection({
  filteredMyList,
  malList,
  lists,
  listsMap,
  watchedEpsMap,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleSetList,
  handleRemove,
}: MyListSectionProps) {
  return (
    <section className="section">
      <header className="section-head">
        <div>
          <h2 className="section-title">My list</h2>
          <p className="section-sub">Everything you&apos;re tracking</p>
        </div>
        <div className="section-actions">
          <div className="ta-sort">
            <span className="ta-sort-label">Sort by</span>
            <select
              className="ta-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'release_date' | 'date_added')}
            >
              <option value="date_added">Date Added</option>
              <option value="name">Name</option>
              <option value="release_date">Release Date</option>
            </select>
            <button
              className="sort-toggle"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortOrder === 'asc' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /><path d="M11 12h10" /><path d="M11 16h7" /><path d="M11 20h4" /><path d="M11 8h10" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4" /><path d="M7 20V4" /><path d="M11 12h10" /><path d="M11 16h7" /><path d="M11 20h4" /><path d="M11 8h10" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <div className="filters" role="tablist" aria-label="Filter my list">
        {FILTERS.map((f) => {
          const count = malList
            ? malList.filter((item) => item.listKey === f.key).length
            : (lists as Record<string, string>)[f.key] !== undefined
              ? Object.values(lists).filter((v) => v === f.key).length
              : 0;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={'filter-chip' + (activeFilter === f.key ? ' is-active' : '')}
              onClick={() => setActiveFilter(f.key)}
            >
              <span className={'filter-dot filter-dot--' + f.key}></span>
              {f.label}
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid">
        {filteredMyList.length === 0 ? (
          <div className="empty">
            <div className="empty-mark">∅</div>
            <div className="empty-title">
              Nothing in {FILTERS.find((f) => f.key === activeFilter)?.label.toLowerCase()}
            </div>
            <div className="empty-sub">Use the menu on any card to move it here.</div>
          </div>
        ) : (
          filteredMyList.map((a) => (
            <AnimeCard
              key={a.id}
              anime={a}
              currentList={listsMap[a.id] ?? null}
              watchedEps={watchedEpsMap[a.id] ?? 0}
              onSetList={(k) => handleSetList(a.id, k)}
              onRemove={() => handleRemove(a.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
