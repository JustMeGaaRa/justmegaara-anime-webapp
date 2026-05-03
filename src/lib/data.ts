import type { Anime, Lists, WatchedEps } from './types';

const POSTER_PALETTES: [string, string, string][] = [
  ['#3b1f4a', '#7a2e6e', '#f0a3c5'],
  ['#0e2a4a', '#1f5fa8', '#7ec9ff'],
  ['#2a1810', '#a8511f', '#f5c98a'],
  ['#0d2620', '#1f7a5a', '#9be8c8'],
  ['#3d0e2a', '#a31f5f', '#ff9bcc'],
  ['#1a1830', '#4f3fa8', '#b8a8ff'],
  ['#2a2010', '#9a8410', '#f5e08a'],
  ['#10242a', '#1f7080', '#8adfff'],
  ['#3a1a1a', '#a83838', '#ffb8b8'],
  ['#1a2a1a', '#4a8a4a', '#c8f0c8'],
  ['#2a1a3a', '#6a3aaa', '#d8b8ff'],
  ['#3a2a1a', '#aa6a3a', '#ffd8b8'],
];

function makePoster(id: number, title: string, palette: [string, string, string]): string {
  const [bg, mid, fg] = palette;
  const lines = title.split(/\s+/).reduce((acc: string[], word: string) => {
    const last = acc[acc.length - 1];
    if (last && (last + ' ' + word).length <= 14) acc[acc.length - 1] = last + ' ' + word;
    else acc.push(word);
    return acc;
  }, []);
  const textRows = lines
    .map(
      (l, i) =>
        `<text x="100" y="${210 + i * 18}" font-family="Outfit, sans-serif" font-size="14" font-weight="700" fill="${fg}" text-anchor="middle" letter-spacing="0.5">${l
          .toUpperCase()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</text>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="${mid}"/>
      </linearGradient>
      <pattern id="p${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="8" height="8" fill="${bg}" fill-opacity="0"/>
        <rect width="2" height="8" fill="${fg}" fill-opacity="0.06"/>
      </pattern>
    </defs>
    <rect width="200" height="280" fill="url(#g${id})"/>
    <rect width="200" height="280" fill="url(#p${id})"/>
    <circle cx="160" cy="60" r="40" fill="${fg}" fill-opacity="0.18"/>
    <circle cx="40" cy="220" r="60" fill="${fg}" fill-opacity="0.10"/>
    <rect x="0" y="190" width="200" height="60" fill="#000" fill-opacity="0.55"/>
    ${textRows}
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const SEASONS = [
  'Winter 2024', 'Spring 2024', 'Summer 2024', 'Fall 2024',
  'Winter 2025', 'Spring 2025', 'Summer 2025', 'Fall 2025',
  'Winter 2026', 'Spring 2026',
];
const STATUSES: Anime['status'][] = ['Currently Airing', 'Finished', 'Upcoming'];
const GENRE_POOL = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Mystery',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller',
  'Supernatural', 'Music', 'Horror', 'Mecha',
];
const RATINGS = ['G', 'PG', 'PG-13', 'R'];

const TITLES = [
  'Lantern of the Hollow Sea', 'Paper Moon Atlas', 'Sunflower Patrol', 'Ironroot Academy',
  'The Cartographer\'s Cat', 'Quietfall', 'Glassblower\'s Lullaby', 'Saturday Mecha Club',
  'Vellum Knights', 'The Tea House at Dusk', 'Mirrorgrass', 'Nightmarket Couriers',
  'The Last Origami Star', 'Bicycle Garrison', 'Sandcastle Treaty', 'Foxfire Diner',
  'The Astronomer\'s Apprentice', 'Waltz of the Tin Soldiers', 'Rainwriter', 'Kettle & Comet',
  'The Silver Library', 'Bonfire Postcards', 'Thunder Lily', 'Conductor of Lost Trains',
  'The Marble Garden', 'Pinecone Cipher', 'Echo of the Riverboat', 'Lighthouse Keeper\'s Ghost',
  'Moss Choir', 'The Velvet Confectioner', 'Iron Sparrows', 'Stationmaster\'s Daughter',
  'The Midnight Florist', 'Compass Without a North', 'Salt and Constellations', 'The Brassworks',
  'Featherweight Detective', 'Petrichor Sonata', 'The Window Mender', 'Kite Squadron Forever',
  'The Owl Reporter', 'Lemonade Pact', 'Snowflake Architect', 'The Quiet Forge',
  'Cardinal Tide', 'The Inkwell Apartments', 'Lavender Express', 'Mosaic Wing',
  'The Pocketwatch Society', 'Seafoam Memorandum',
];

const STUDIOS = [
  'Studio Lumen', 'Hanagumi Works', 'Kintsugi Animation', 'Fox & Foundry',
  'Northwind Pictures', 'Atelier Mosaic', 'Studio Kettle', 'Paperbark Animation',
];
const SOURCES = ['Manga', 'Light Novel', 'Original', 'Web Novel', 'Game', 'Visual Novel'];
const SYNOPSIS_TEMPLATES = [
  "When a quiet apprentice stumbles on a forgotten map, an unlikely band sets out across a country that has been politely pretending nothing is wrong. Tea is consumed. Decisions are not made. Something underground hums.",
  "A repair shop on the edge of a port city takes in objects nobody else will touch. Each one carries a story that the new hire — who insists she is only here for the summer — slowly learns to mend.",
  "Three classmates form a club nobody asked for and accidentally become the most important thing in their small town. Heartfelt, low-stakes, occasionally cosmic.",
  "Two rival cartographers, one ghost-haunted bicycle, and an entire winter to settle a bet that should never have been made.",
  "The kingdom's last working printing press is run by a teenager, a retired knight, and a cat who reviews manuscripts. Politics gets complicated.",
];

export const ANIME: Anime[] = TITLES.map((title, i) => {
  const palette = POSTER_PALETTES[i % POSTER_PALETTES.length];
  const score = parseFloat((6.5 + (Math.sin(i * 1.7) + 1) * 1.4).toFixed(2));
  const userCount = Math.floor(120 + Math.abs(Math.sin(i * 2.3)) * 9000);
  const rank = i + 1;
  const season = SEASONS[(i * 3) % SEASONS.length];
  const status = STATUSES[i % 3];
  const ageRating = RATINGS[i % RATINGS.length];
  const episodes = 12 + (i % 4) * 12;
  const g1 = GENRE_POOL[i % GENRE_POOL.length];
  let g2 = GENRE_POOL[(i * 5 + 3) % GENRE_POOL.length];
  if (g2 === g1) g2 = GENRE_POOL[(i * 5 + 4) % GENRE_POOL.length];

  const studio = STUDIOS[i % STUDIOS.length];
  const source = SOURCES[i % SOURCES.length];
  const duration = 22 + (i % 3) * 2;
  const year = 2018 + (i % 8);
  const synopsis = SYNOPSIS_TEMPLATES[i % SYNOPSIS_TEMPLATES.length];
  const seasonCount = 1 + (i % 4);
  const seasons = Array.from({ length: seasonCount }, (_, s) => ({
    n: s + 1,
    year: year + s,
    episodes: 12 + (s % 2) * 12,
    isCurrent: s === seasonCount - 1 && status === 'Currently Airing',
  }));

  return {
    id: 'a' + i,
    title,
    poster: makePoster(i, title, palette),
    palette,
    season,
    status,
    score,
    userCount,
    rank,
    ageRating,
    episodes,
    genres: [g1, g2],
    studio,
    source,
    duration,
    year,
    synopsis,
    seasons,
    relatedIds: [],
  };
});

// Wire up relatedIds after the array is built
ANIME.forEach((a, i) => {
  a.relatedIds = Array.from({ length: 6 }, (_, k) => ANIME[(i + 1 + k) % ANIME.length].id);
});

export const ANIME_BY_ID: Record<string, Anime> = Object.fromEntries(ANIME.map((a) => [a.id, a]));

export const INITIAL_LISTS: Lists = {};
export const WATCHED_EPS: WatchedEps = {};
const recentlyWatchedRaw: { id: string; lastWatchedAt: number }[] = [];

ANIME.forEach((a, i) => {
  let bucket: string | null = null;
  if (i % 7 === 0) bucket = 'completed';
  else if (i % 5 === 0) bucket = 'watching';
  else if (i % 11 === 0) bucket = 'on-hold';
  else if (i % 13 === 0) bucket = 'dropped';
  else if (i % 4 === 0) bucket = 'planned';

  if (bucket) {
    INITIAL_LISTS[a.id] = bucket as Lists[string];
    if (bucket === 'watching') {
      WATCHED_EPS[a.id] = Math.max(1, Math.floor(a.episodes * (0.2 + (i % 5) * 0.15)));
    } else if (bucket === 'completed') {
      WATCHED_EPS[a.id] = a.episodes;
    } else {
      WATCHED_EPS[a.id] = 0;
    }
  }
});

ANIME.forEach((a, i) => {
  if (INITIAL_LISTS[a.id] === 'watching' || INITIAL_LISTS[a.id] === 'completed') {
    recentlyWatchedRaw.push({ id: a.id, lastWatchedAt: Date.now() - i * 1000 * 60 * 60 * 7 });
  }
});
recentlyWatchedRaw.sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);

export const RECENTLY_WATCHED_IDS: string[] = recentlyWatchedRaw.map((r) => r.id);
export const TRENDING_IDS: string[] = ANIME.slice(0, 20).map((a) => a.id);

export const LIST_LABELS: Record<string, string> = {
  watching: 'Watching',
  planned: 'Plan to Watch',
  completed: 'Completed',
  'on-hold': 'On Hold',
  dropped: 'Dropped',
};

export const LIST_ORDER = ['watching', 'planned', 'completed', 'on-hold', 'dropped'];

export const FILTERS = [
  { key: 'watching', label: 'Watching' },
  { key: 'planned', label: 'Plan to Watch' },
  { key: 'completed', label: 'Completed' },
  { key: 'on-hold', label: 'On Hold' },
  { key: 'dropped', label: 'Dropped' },
];
