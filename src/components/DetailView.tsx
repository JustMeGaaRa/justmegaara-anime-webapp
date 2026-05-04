'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ANIME_BY_ID, LIST_LABELS, LIST_ORDER } from '@/lib/data';
import { useStore } from '@/lib/store';
import AnimeCard from './AnimeCard';
import HorizontalScroller from './HorizontalScroller';
import type { Anime, ListKey } from '@/lib/types';
import { updateAnimeStatus, deleteAnimeFromList } from '@/app/actions';
import { unmapListStatus } from '@/lib/mapper';

function DetailAttr({ label, value }: { label: string; value: string }) {
  return (
    <div className="dt-attr">
      <div className="dt-attr-label">{label}</div>
      <div className="dt-attr-value">{value}</div>
    </div>
  );
}

function ListSwitcher({
  current,
  onSetList,
  onRemove,
}: {
  current: string | null;
  onSetList: (k: string) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const label = current ? LIST_LABELS[current] : 'Add to list';

  return (
    <div className="dt-listsw" ref={ref}>
      <button
        className={'dt-btn dt-btn--list' + (current ? ' is-set' : '')}
        onClick={() => setOpen((v) => !v)}
      >
        {current && <span className={'ac-dot ac-dot--' + current}></span>}
        {label}
        <span className="dt-listsw-caret">▾</span>
      </button>
      {open && (
        <div className="ac-menu-pop dt-listsw-pop">
          <div className="ac-menu-label">Move to list</div>
          {LIST_ORDER.map((key) => (
            <button
              key={key}
              className={'ac-menu-item' + (current === key ? ' is-active' : '')}
              onClick={() => {
                onSetList(key);
                setOpen(false);
              }}
            >
              <span className={'ac-dot ac-dot--' + key}></span>
              {LIST_LABELS[key]}
              {current === key && <span className="ac-menu-check">✓</span>}
            </button>
          ))}
          {current && (
            <>
              <div className="ac-menu-sep"></div>
              <button
                className="ac-menu-item ac-menu-item--danger"
                onClick={() => {
                  onRemove();
                  setOpen(false);
                }}
              >
                Remove from my list
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DetailHero({
  anime,
  currentList,
  watchedEps,
  onSetList,
  onRemove,
}: {
  anime: Anime;
  currentList: string | null;
  watchedEps: number;
  onSetList: (k: string) => void;
  onRemove: () => void;
}) {
  const [palBg, palMid, palFg] = anime.palette;

  return (
    <div className="dt-hero">
      <div
        className="dt-keyart"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${palMid}, ${palBg} 60%), linear-gradient(135deg, ${palBg}, ${palMid})`,
        }}
        aria-hidden="true"
      >
        <svg className="dt-keyart-svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="dt-glow" cx="0.7" cy="0.35" r="0.6">
              <stop offset="0%" stopColor={palFg} stopOpacity="0.45" />
              <stop offset="100%" stopColor={palFg} stopOpacity="0" />
            </radialGradient>
            <pattern id="dt-grain" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <rect width="2" height="6" fill={palFg} fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="800" height="500" fill="url(#dt-glow)" />
          <rect width="800" height="500" fill="url(#dt-grain)" />
          <circle cx="600" cy="200" r="120" fill={palFg} fillOpacity="0.18" />
          <circle cx="640" cy="160" r="60" fill={palFg} fillOpacity="0.25" />
          <path
            d="M 0 380 Q 200 320 400 360 T 800 340 L 800 500 L 0 500 Z"
            fill={palBg}
            fillOpacity="0.5"
          />
          <path
            d="M 0 420 Q 250 380 500 410 T 800 400 L 800 500 L 0 500 Z"
            fill={palBg}
            fillOpacity="0.7"
          />
        </svg>
        <div className="dt-keyart-fade"></div>
      </div>

      <div className="dt-hero-inner">
        <div className="dt-hero-left">
          <div className="dt-poster">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={anime.poster} alt="" />
            <span className="ac-rating-pill">{anime.ageRating}</span>
          </div>
        </div>
        <div className="dt-hero-main">
          <div className="dt-spotlight">#{anime.rank} Spotlight</div>
          <h1 className="dt-title">{anime.title}</h1>
          <div className="dt-meta">
            <span className="dt-meta-pill">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="3" fill="currentColor" />
              </svg>
              TV
            </span>
            <span className="dt-meta-pill">{anime.duration}m</span>
            <span className="dt-meta-pill">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="1.5" y="2.5" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
                <line x1="1.5" y1="4" x2="8.5" y2="4" stroke="currentColor" strokeWidth="1" />
              </svg>
              {anime.season}
            </span>
            <span className="dt-meta-pill dt-meta-pill--hd">HD</span>
            <span className="dt-meta-pill dt-meta-pill--cc">
              CC <b>{anime.episodes}</b>
            </span>
            <span className="dt-meta-pill dt-meta-pill--mic">
              🎙 <b>{Math.max(2, anime.episodes - 4)}</b>
            </span>
          </div>
          <p className="dt-synopsis">{anime.synopsis}</p>
          <div className="dt-actions">
            {currentList === 'watching' ? (
              <button className="dt-btn dt-btn--primary">▶ Continue Ep {watchedEps + 1}</button>
            ) : (
              <button className="dt-btn dt-btn--primary">▶ Watch Now</button>
            )}
            <ListSwitcher current={currentList} onSetList={onSetList} onRemove={onRemove} />
          </div>
          <div className="dt-attrs">
            <DetailAttr label="Studio" value={anime.studio} />
            <DetailAttr label="Source" value={anime.source} />
            <DetailAttr label="Genres" value={anime.genres.join(', ')} />
            <DetailAttr label="Status" value={anime.status} />
            <DetailAttr label="Score" value={`★ ${anime.score.toFixed(2)}`} />
            <DetailAttr label="Ranked" value={`#${anime.rank}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SeasonsList({ anime }: { anime: Anime }) {
  if (!anime.seasons?.length) return null;
  return (
    <section className="dt-seasons-section section">
      <header className="section-head">
        <div>
          <h2 className="section-title">Seasons</h2>
        </div>
      </header>
      <div className="dt-seasons">
        {anime.seasons.map((s) => (
          <div key={s.n} className={'dt-season' + (s.isCurrent ? ' is-current' : '')}>
            <div className="dt-season-n">{String(s.n).padStart(2, '0')}</div>
            <div>
              <div className="dt-season-title">Season {s.n}</div>
              <div className="dt-season-meta">
                {s.year} · {s.episodes} episodes
              </div>
            </div>
            {s.isCurrent && <div className="dt-season-badge">Airing</div>}
            <button className="dt-season-go" aria-label="View season">›</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DetailView({ initialAnime }: { initialAnime: Anime | null }) {
  const router = useRouter();
  const { lists, watchedEps, setListFor, removeFrom } = useStore();
  const anime = initialAnime;

  useEffect(() => {
    if (anime && anime.listKey && !lists[anime.id]) {
      setListFor(anime.id, anime.listKey);
    }
  }, [anime, lists, setListFor]);

  if (!anime) {
    return (
      <main className="page page--detail">
        <button onClick={() => router.back()} className="ghost-btn dt-back">
          ← Back
        </button>
        <div className="empty">
          <div className="empty-mark">...</div>
          <div className="empty-title">Loading anime data...</div>
        </div>
      </main>
    );
  }

  const handleSetList = async (key: string) => {
    setListFor(anime.id, key);
    try {
      await updateAnimeStatus(Number(anime.id), unmapListStatus(key as ListKey));
    } catch (err) {
      console.error('[DetailView] Failed to update MAL status:', err);
    }
  };

  const handleRemove = async () => {
    removeFrom(anime.id);
    try {
      await deleteAnimeFromList(Number(anime.id));
    } catch (err) {
      console.error('[DetailView] Failed to remove from MAL:', err);
    }
  };

  const currentList = lists[anime.id] ?? anime.listKey ?? null;
  const currentWatchedEps = watchedEps[anime.id] ?? anime.watchedEps ?? 0;
  const related = anime.relatedIds
    .map((id) => ANIME_BY_ID[id])
    .filter((a): a is Anime => !!a);

  return (
    <main className="page page--detail">
      <button onClick={() => router.back()} className="ghost-btn dt-back" style={{ display: 'inline-flex' }}>
        <span>←</span> Back
      </button>
      <DetailHero
        anime={anime}
        currentList={currentList}
        watchedEps={currentWatchedEps}
        onSetList={handleSetList}
        onRemove={handleRemove}
      />
      <SeasonsList anime={anime} />
      {related.length > 0 && (
        <section className="section">
          <header className="section-head">
            <div>
              <h2 className="section-title">More like this</h2>
              <p className="section-sub">Based on genre and studio</p>
            </div>
          </header>
          <HorizontalScroller>
            {related.map((a) => (
              <div className="row-card" key={a.id}>
                <AnimeCard
                  anime={a}
                  currentList={lists[a.id] ?? null}
                  watchedEps={watchedEps[a.id] ?? 0}
                  onSetList={async (k) => {
                    setListFor(a.id, k);
                    try {
                      await updateAnimeStatus(Number(a.id), unmapListStatus(k as ListKey));
                    } catch (err) {
                      console.error('[DetailView] Failed to update related anime status:', err);
                    }
                  }}
                  onRemove={async () => {
                    removeFrom(a.id);
                    try {
                      await deleteAnimeFromList(Number(a.id));
                    } catch (err) {
                      console.error('[DetailView] Failed to remove related anime:', err);
                    }
                  }}
                />
              </div>
            ))}
          </HorizontalScroller>
        </section>
      )}
    </main>
  );
}
