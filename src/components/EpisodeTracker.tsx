import React from 'react';
import './EpisodeTracker.css';

interface EpisodeGridProps {
  totalEpisodes: number;
  watchedCount: number;
  startEpisode?: number;
  onEpisodeChange?: (episode: number) => void;
}

export const EpisodeGrid: React.FC<EpisodeGridProps> = ({
  totalEpisodes,
  watchedCount,
  startEpisode = 1,
  onEpisodeChange,
}) => {
  const effectiveTotal = totalEpisodes > 0
    ? totalEpisodes
    : Math.max(0, watchedCount - startEpisode + 2);

  const episodes = Array.from({ length: effectiveTotal }, (_, i) => startEpisode + i);

  return (
    <div className="et-grid-wrapper">
      <div className="et-legend">
        <div className="et-legend-item">
          <div className="et-box et-box--watched"></div>
          <span>Watched</span>
        </div>
        <div className="et-legend-item">
          <div className="et-box et-box--unwatched"></div>
          <span>Not yet watched</span>
        </div>
      </div>

      <div className="et-grid">
        {episodes.map((ep) => {
          const stateClass = ep <= watchedCount
            ? 'et-ep--watched'
            : 'et-ep--unwatched';

          return (
            <button
              key={ep}
              className={`et-ep-btn ${stateClass}`}
              onClick={() => onEpisodeChange?.(ep)}
              aria-label={`Episode ${ep}`}
            >
              {ep}
            </button>
          );
        })}
      </div>

      <p className="et-hint">
        Tap an episode number to mark it as watched — all previous episodes are updated automatically.
      </p>
    </div>
  );
};
