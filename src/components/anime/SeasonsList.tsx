'use client';

import React, { useState } from 'react';
import type { Anime } from '@/lib/types';
import { EpisodeGrid } from '../EpisodeTracker';

interface SeasonsListProps {
  anime: Anime;
  currentWatchedEps: number;
  onEpisodeChange: (ep: number) => void;
}

export function SeasonsList({
  anime,
  currentWatchedEps,
  onEpisodeChange
}: SeasonsListProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [prevWatchedEps, setPrevWatchedEps] = useState<number | null>(null);

  if (currentWatchedEps !== prevWatchedEps) {
    setPrevWatchedEps(currentWatchedEps);
    if (anime.seasons?.length) {
      let accumulated = 0;
      let found = anime.seasons[0].n;
      for (const s of anime.seasons) {
        if (s.episodes === 0 || (currentWatchedEps >= accumulated && currentWatchedEps < accumulated + s.episodes)) {
          found = s.n;
          break;
        }
        accumulated += s.episodes;
      }
      setExpandedSeason(found);
    }
  }

  if (!anime.seasons?.length) return null;

  return (
    <section className="dt-seasons-section section">
      <header className="section-head">
        <div>
          <h2 className="section-title">Seasons</h2>
        </div>
      </header>
      <div className="dt-seasons">
        {anime.seasons.map((s, idx) => {
          const isExpanded = expandedSeason === s.n;

          // Calculate the global episode offset for this season
          let startEp = 1;
          for (let i = 0; i < idx; i++) {
            startEp += anime.seasons[i].episodes;
          }

          return (
            <div key={s.n} className="dt-season-container">
              <div
                className={'dt-season' + (s.isCurrent ? ' is-current' : '') + (isExpanded ? ' is-expanded' : '')}
                onClick={() => setExpandedSeason(isExpanded ? null : s.n)}
              >
                <div className="dt-season-n">{String(s.n).padStart(2, '0')}</div>
                <div style={{ flex: 1 }}>
                  <div className="dt-season-title">Season {s.n}</div>
                  <div className="dt-season-meta">
                    {s.year} · {s.episodes || '?'} episodes
                  </div>
                </div>
                {s.isCurrent && <div className="dt-season-badge">Airing</div>}
                <button className="dt-season-go" aria-label="Toggle season">
                  {isExpanded ? '▾' : '›'}
                </button>
              </div>

              {isExpanded && (
                <div className="dt-season-tracker">
                  <EpisodeGrid
                    totalEpisodes={s.episodes}
                    watchedCount={currentWatchedEps}
                    startEpisode={startEp}
                    onEpisodeChange={onEpisodeChange}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
