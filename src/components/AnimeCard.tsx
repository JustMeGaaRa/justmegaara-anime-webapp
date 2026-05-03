'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LIST_LABELS, LIST_ORDER } from '@/lib/data';
import type { Anime } from '@/lib/types';

function StatusPill({ status }: { status: Anime['status'] }) {
  const cls =
    status === 'Currently Airing'
      ? 'ac-pill ac-pill--airing'
      : status === 'Upcoming'
        ? 'ac-pill ac-pill--upcoming'
        : 'ac-pill';
  return <span className={cls}>{status}</span>;
}

interface CardMenuProps {
  anime: Anime;
  currentList: string | null;
  onSetList: (key: string) => void;
  onRemove: () => void;
}

function CardMenu({ anime, currentList, onSetList, onRemove }: CardMenuProps) {
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

  return (
    <div className="ac-menu" ref={ref}>
      <button
        className="ac-menu-trigger"
        aria-label={`Manage ${anime.title}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="3" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="13" cy="8" r="1.4" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          className="ac-menu-pop"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="ac-menu-label">Move to list</div>
          {LIST_ORDER.map((key) => (
            <button
              key={key}
              className={'ac-menu-item' + (currentList === key ? ' is-active' : '')}
              onClick={(e) => {
                e.stopPropagation();
                onSetList(key);
                setOpen(false);
              }}
            >
              <span className={'ac-dot ac-dot--' + key}></span>
              {LIST_LABELS[key]}
              {currentList === key && <span className="ac-menu-check">✓</span>}
            </button>
          ))}
          {currentList && (
            <>
              <div className="ac-menu-sep"></div>
              <button
                className="ac-menu-item ac-menu-item--danger"
                onClick={(e) => {
                  e.stopPropagation();
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

interface AnimeCardProps {
  anime: Anime;
  currentList: string | null;
  watchedEps: number;
  onSetList: (key: string) => void;
  onRemove: () => void;
  density?: 'compact' | 'regular' | 'comfy';
  clickable?: boolean;
}

export default function AnimeCard({
  anime,
  currentList,
  watchedEps,
  onSetList,
  onRemove,
  density = 'regular',
  clickable = true,
}: AnimeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (clickable) router.push('/anime/' + anime.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      router.push('/anime/' + anime.id);
    }
  };

  return (
    <article
      className={'ac-card ac-card--' + density + (clickable ? ' ac-card--clickable' : '')}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="ac-poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={anime.poster} alt="" />
        <span className="ac-rating-pill">{anime.ageRating}</span>
        {currentList === 'watching' && (
          <div className="ac-progress">
            <div
              className="ac-progress-bar"
              style={{ width: `${Math.min(100, (watchedEps / anime.episodes) * 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className="ac-body">
        <div className="ac-body-top">
          <StatusPill status={anime.status} />
          <CardMenu
            anime={anime}
            currentList={currentList}
            onSetList={onSetList}
            onRemove={onRemove}
          />
        </div>
        <div className="ac-season" title={anime.season}>
          {anime.season}
        </div>
        <h3 className="ac-title" title={anime.title}>
          {anime.title}
        </h3>
        <div className="ac-stats">
          <span className="ac-stat">
            <span className="ac-star">★</span>
            <span className="ac-stat-num">{anime.score.toFixed(2)}</span>
            <span className="ac-stat-sub">{anime.userCount.toLocaleString('en-US')} users</span>
          </span>
          <span className="ac-stat">
            <span className="ac-stat-hash">#</span>
            <span className="ac-stat-num">{anime.rank.toLocaleString('en-US')}</span>
            <span className="ac-stat-sub">Ranking</span>
          </span>
        </div>
        {currentList === 'watching' && (
          <div className="ac-eps">
            Ep {watchedEps} / {anime.episodes}
          </div>
        )}
        <div className="ac-badges">
          {anime.genres.map((g) => (
            <span key={g} className="ac-badge">
              {g}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
