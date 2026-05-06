'use client';

import React from 'react';
import type { Anime } from '@/lib/types';
import { ListSwitcher } from './ListSwitcher';
import { DescriptionList } from '../ui/DescriptionList';

interface DetailHeroProps {
  anime: Anime;
  currentList: string | null;
  watchedEps: number;
  onSetList: (k: string) => void;
  onRemove: () => void;
}

export function DetailHero({
  anime,
  currentList,
  watchedEps,
  onSetList,
  onRemove,
}: DetailHeroProps) {
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
              CC <b>{anime.episodes || '?'}</b>
            </span>
            <span className="dt-meta-pill dt-meta-pill--mic">
              🎙 <b>{anime.episodes > 0 ? Math.max(2, anime.episodes - 4) : '?'}</b>
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
          <DescriptionList>
            <DescriptionList.Item>
              <DescriptionList.Term>Studio</DescriptionList.Term>
              <DescriptionList.Details>{anime.studio}</DescriptionList.Details>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>Source</DescriptionList.Term>
              <DescriptionList.Details>{anime.source}</DescriptionList.Details>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>Genres</DescriptionList.Term>
              <DescriptionList.Details>{anime.genres.join(', ')}</DescriptionList.Details>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>Status</DescriptionList.Term>
              <DescriptionList.Details>{anime.status}</DescriptionList.Details>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>Score</DescriptionList.Term>
              <DescriptionList.Details>★ {anime.score.toFixed(2)}</DescriptionList.Details>
            </DescriptionList.Item>
            <DescriptionList.Item>
              <DescriptionList.Term>Ranked</DescriptionList.Term>
              <DescriptionList.Details>#{anime.rank}</DescriptionList.Details>
            </DescriptionList.Item>
          </DescriptionList>
        </div>
      </div>
    </div>
  );
}
