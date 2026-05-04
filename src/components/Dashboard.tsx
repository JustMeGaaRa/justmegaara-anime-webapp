'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ANIME, ANIME_BY_ID, FILTERS, RECENTLY_WATCHED_IDS } from '@/lib/data';
import { useStore } from '@/lib/store';
import type { MALProfileData, MALListItem } from '@/app/page';
import type { ListKey } from '@/lib/types';
import AnimeCard from './AnimeCard';
import HorizontalScroller from './HorizontalScroller';
import { updateAnimeStatus, deleteAnimeFromList } from '@/app/actions';
import { unmapListStatus } from '@/lib/mapper';

function HeroStat({ n, label, emphasis }: { n: number; label: string; emphasis?: boolean }) {
  return (
    <div className={'hero-stat' + (emphasis ? ' hero-stat--emph' : '')}>
      <div className="hero-stat-n">{n}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

interface DashboardProps {
  malData?: MALProfileData | null;
}

export default function Dashboard({ malData }: DashboardProps) {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [activeFilter, setActiveFilter] = useState('watching');

  // Local copy of MAL list so UI updates (move/remove) are reflected immediately
  const [malList, setMalList] = useState<MALListItem[] | null>(malData?.animeList ?? null);

  const handleSetList = async (id: string, key: string) => {
    // Optimistic UI
    if (malList) {
      setMalList((prev) =>
        prev?.map((item) =>
          item.anime.id === id ? { ...item, listKey: key as ListKey } : item,
        ) ?? null,
      );
    }
    const item = malList?.find(it => it.anime.id === id);
    setListFor(id, key, item?.anime.title || ANIME_BY_ID[id]?.title);

    try {
      await updateAnimeStatus(Number(id), unmapListStatus(key as ListKey));
    } catch (err) {
      console.error('[Dashboard] Failed to update MAL status:', err);
      // Revert store on failure (simple implementation)
      // In a real app we might want a more robust rollback
    }
  };

  const handleRemove = async (id: string) => {
    // Optimistic UI
    if (malList) {
      setMalList((prev) => prev?.filter((item) => item.anime.id !== id) ?? null);
    }
    const item = malList?.find(it => it.anime.id === id);
    removeFrom(id, item?.anime.title || ANIME_BY_ID[id]?.title);

    try {
      await deleteAnimeFromList(Number(id));
    } catch (err) {
      console.error('[Dashboard] Failed to remove from MAL:', err);
      // Revert store on failure
    }
  };

  // Stats — prefer real MAL statistics, fall back to counting from store
  const stats = useMemo(() => {
    const malStats = malData?.user.anime_statistics;
    if (malStats) {
      return {
        watching: malStats.num_items_watching,
        planned: malStats.num_items_plan_to_watch,
        completed: malStats.num_items_completed,
        total: malStats.num_items,
      };
    }
    const c: Record<string, number> = { watching: 0, planned: 0, completed: 0 };
    Object.values(lists).forEach((v) => {
      if (c[v] !== undefined) c[v]++;
    });
    return {
      watching: c.watching,
      planned: c.planned,
      completed: c.completed,
      total: Object.values(lists).length,
    };
  }, [malData, lists]);

  // Recently watched — most recently updated anime from the MAL list, or fall back to mock
  const recentlyWatched = useMemo(() => {
    if (malList) {
      return [...malList]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 12)
        .map((item) => item.anime);
    }
    return RECENTLY_WATCHED_IDS.map((id) => ANIME_BY_ID[id]).filter(Boolean).slice(0, 12);
  }, [malList]);

  // My list filtered by active tab
  const filteredMyList = useMemo(() => {
    if (malList) {
      return malList
        .filter((item) => item.listKey === activeFilter)
        .map((item) => item.anime);
    }
    return ANIME.filter((a) => lists[a.id] === activeFilter);
  }, [malList, lists, activeFilter]);

  // Watched episodes per anime id
  const watchedEpsMap = useMemo(() => {
    if (malList) {
      return Object.fromEntries(malList.map((item) => [item.anime.id, item.watchedEps]));
    }
    return watchedEps;
  }, [malList, watchedEps]);

  // Current list key per anime id
  const listsMap = useMemo(() => {
    if (malList) {
      return Object.fromEntries(malList.map((item) => [item.anime.id, item.listKey]));
    }
    return lists;
  }, [malList, lists]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-greet">
          <div className="hero-eyebrow">Welcome back{malData?.user.name ? `, ${malData.user.name}` : ''}</div>
          <h1 className="hero-title">What are you watching tonight?</h1>
        </div>
        <div className="hero-stats">
          <HeroStat n={stats.watching} label="Watching" />
          <HeroStat n={stats.planned} label="Planned" />
          <HeroStat n={stats.completed} label="Completed" />
          <HeroStat n={stats.total} label="On your list" emphasis />
        </div>
      </section>

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

      <section className="section">
        <header className="section-head">
          <div>
            <h2 className="section-title">My list</h2>
            <p className="section-sub">Everything you&apos;re tracking</p>
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

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Link href="/trending" className="action-link" style={{ display: 'inline-flex' }}>
          Browse trending <span>→</span>
        </Link>
      </div>
    </main>
  );
}
