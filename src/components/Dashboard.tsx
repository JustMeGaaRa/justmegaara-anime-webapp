'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ANIME, ANIME_BY_ID, FILTERS, RECENTLY_WATCHED_IDS } from '@/lib/data';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';
import HorizontalScroller from './HorizontalScroller';

function HeroStat({ n, label, emphasis }: { n: number; label: string; emphasis?: boolean }) {
  return (
    <div className={'hero-stat' + (emphasis ? ' hero-stat--emph' : '')}>
      <div className="hero-stat-n">{n}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const [activeFilter, setActiveFilter] = useState('watching');

  const counts = useMemo(() => {
    const c: Record<string, number> = { watching: 0, planned: 0, completed: 0, 'on-hold': 0, dropped: 0 };
    Object.values(lists).forEach((v) => { if (c[v] !== undefined) c[v]++; });
    return c;
  }, [lists]);

  const totalOnList = Object.values(counts).reduce((a, b) => a + b, 0);

  const recentlyWatched = useMemo(
    () => RECENTLY_WATCHED_IDS.map((id) => ANIME_BY_ID[id]).filter(Boolean).slice(0, 12),
    [],
  );

  const filteredMyList = useMemo(
    () => ANIME.filter((a) => lists[a.id] === activeFilter),
    [lists, activeFilter],
  );

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-greet">
          <div className="hero-eyebrow">Welcome back</div>
          <h1 className="hero-title">What are you watching tonight?</h1>
        </div>
        <div className="hero-stats">
          <HeroStat n={counts.watching} label="Watching" />
          <HeroStat n={counts.planned} label="Planned" />
          <HeroStat n={counts.completed} label="Completed" />
          <HeroStat n={totalOnList} label="On your list" emphasis />
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
                currentList={lists[a.id] ?? null}
                watchedEps={watchedEps[a.id] ?? 0}
                onSetList={(k) => setListFor(a.id, k)}
                onRemove={() => removeFrom(a.id)}
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
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={'filter-chip' + (activeFilter === f.key ? ' is-active' : '')}
              onClick={() => setActiveFilter(f.key)}
            >
              <span className={'filter-dot filter-dot--' + f.key}></span>
              {f.label}
              <span className="filter-count">{counts[f.key] ?? 0}</span>
            </button>
          ))}
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
                currentList={lists[a.id] ?? null}
                watchedEps={watchedEps[a.id] ?? 0}
                onSetList={(k) => setListFor(a.id, k)}
                onRemove={() => removeFrom(a.id)}
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
