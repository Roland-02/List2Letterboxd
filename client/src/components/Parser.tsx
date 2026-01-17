export type FilmEntry = {
  tmdbId?: number;
  title: string;
  rating?: number; // normalized to /5 with .5 steps (e.g. 7/10 -> 3.5)
  review?: string;
  liked?: boolean; // intentionally unused/left blank
  // possible TMDB candidates for disambiguation
  candidates?: Array<{ title: string; tmdbId: number; releaseYear?: number; summary?: string }>;
};

// --- TMDB API Config ---
const TMDB_TOKEN = process.env.REACT_APP_TMDB_TOKEN || '';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Debug: Check if token is loaded
if (!TMDB_TOKEN) {
  console.warn('⚠️ TMDB_TOKEN is not set! Create a .env file with REACT_APP_TMDB_TOKEN=your_token');
}

// --- Matching helpers ---
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/'/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function similarity(a: string, b: string): number {
  const wordsA = normalize(a).split(' ').filter(Boolean);
  const wordsB = normalize(b).split(' ').filter(Boolean);
  const setB = new Set(wordsB);
  if (wordsA.length === 0 && wordsB.length === 0) return 1.0;
  const intersection = wordsA.filter(x => setB.has(x)).length;
  const unionSet = new Set(wordsA.concat(wordsB));
  return unionSet.size > 0 ? intersection / unionSet.size : 0;
}

interface TMDBResult {
  id: number;
  title?: string;
  original_title?: string;
  release_date?: string;
  vote_count?: number;
  overview?: string;
}

function pickBest(results: TMDBResult[], title: string): TMDBResult | null {
  let best: TMDBResult | null = null;
  let bestScore = -Infinity;

  for (const res of results) {
    const names = [res.title, res.original_title].filter(Boolean) as string[];
    const titleScore = Math.max(...names.map(n => similarity(title, n)), 0);
    const popularityBonus = (res.vote_count || 0) > 500 ? 0.05 : 0;
    const score = titleScore + popularityBonus;
    
    if (score > bestScore) {
      best = res;
      bestScore = score;
    }
  }

  return best;
}

// --- Single TMDB API call per film ---
async function tmdbSearchMovie(title: string, language: string): Promise<TMDBResult[]> {
  try {
    const params = new URLSearchParams({
      query: title,
      include_adult: 'false',
      page: '1',
      language
    });

    const res = await fetch(`${TMDB_BASE}/search/movie?${params}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${TMDB_TOKEN}`
      }
    });

    if (!res.ok) {
      console.error('TMDB search failed:', res.status);
      return [];
    }
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('TMDB search error:', err);
    return [];
  }
}

interface MatchResult {
  title: string | null;
  tmdb_id: number | null;
  candidates: Array<{
    title: string;
    tmdb_id: number;
    release_year: number | null;
    summary: string;
  }>;
}

async function matchOne(title: string, language: string): Promise<MatchResult> {
  const clean = title.trim();
  const hits = await tmdbSearchMovie(clean, language);
  const best = pickBest(hits, clean);

  const result: MatchResult = {
    title: null,
    tmdb_id: null,
    candidates: []
  };

  // Build candidates list (top 5)
  for (const res of hits.slice(0, 5)) {
    const rd = res.release_date;
    const year = rd && rd.length >= 4 && /^\d{4}/.test(rd) ? parseInt(rd.slice(0, 4), 10) : null;
    
    const overview = res.overview || '';
    let summary = overview.split('.')[0] || '';
    if (summary.length > 100) {
      summary = summary.slice(0, 97) + '...';
    }

    result.candidates.push({
      title: res.title || '',
      tmdb_id: res.id,
      release_year: year,
      summary
    });
  }

  if (best) {
    result.title = best.title || null;
    result.tmdb_id = best.id;
  }

  return result;
}

// --- Text parsing ---
export function parseFilmText(input: string): FilmEntry[] {
  const lines = input
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const results: FilmEntry[] = [];

  for (let line of lines) {
    // Strip bullets/checkboxes
    line = line.replace(
      /^\s*(?:[-*•]+|\d+[.)])?\s*(?:\[(?:x|X|\s)?\])?\s*/,
      ""
    );

    const entry: FilmEntry = { title: "" };

    // Find rating candidates
    const reSlash = /(\()?\s*(\d+(?:\.\d+)?)\s*\/\s*(100|10|5)\s*(\))?/;
    const mSlash = reSlash.exec(line);

    const reStars = /([★⭐]{1,5})(?:\s*(?:½|1\/2|\.5))?/;
    const mStars = reStars.exec(line);

    type Sel = { start: number; end: number; rating10: number };
    let chosen: Sel | null = null;

    const roundHalf = (n: number) => Math.round(n * 2) / 2;

    if (mSlash) {
      const start = mSlash.index!;
      const end = start + mSlash[0].length;
      const value = parseFloat(mSlash[2]);
      const scale = parseInt(mSlash[3], 10);
      let r10 = value;
      if (scale === 5) r10 = value * 2;
      else if (scale === 100) r10 = value / 10;
      if (r10 >= 0 && r10 <= 10) {
        chosen = { start, end, rating10: roundHalf(r10) };
      }
    }

    if (mStars) {
      const start = mStars.index!;
      const end = start + mStars[0].length;
      const stars =
        (mStars[1].match(/[★⭐]/g)?.length ?? 0) + (mStars[2] ? 0.5 : 0);
      const r10 = roundHalf(stars * 2);
      if (!chosen || start < chosen.start) {
        chosen = { start, end, rating10: r10 };
      }
    }

    if (chosen) {
      entry.rating = roundHalf(chosen.rating10 / 2);

      const before = line.slice(0, chosen.start);
      const after = line.slice(chosen.end);

      const stripEdgeDelims = (s: string) => s
          .replace(/\(\s*\)\s*/g, " ")
          .replace(/^\s*[-–—:|,.;]+/, "")
          .replace(/[-–—:|,.;]+\s*$/, "")
          .trim();

      entry.title = stripEdgeDelims(before);
      const review = stripEdgeDelims(after);
      if (review) entry.review = review;

      if (!entry.title) {
        const m = after.match(/^\s*(.+?)(?:\s(?:-|–|—|\|)\s|$)/);
        entry.title = (m?.[1] ?? after).trim();
        const rest = after.slice(m?.[0]?.length ?? 0).trim();
        if (rest) entry.review = stripEdgeDelims(rest);
      }
    } else {
      entry.title = line;
    }

    if (entry.title) results.push(entry);
  }

  return results;
}

// Peel trailing (YYYY) if present for better matching
function peelYear(t: string) {
  const m = t.match(/\((\d{4})\)\s*$/);
  if (m) {
    const y = Number(m[1]);
    if (y >= 1870 && y <= 2100) {
      return { clean: t.replace(/\s*\(\d{4}\)\s*$/, "").trim(), year: y };
    }
  }
  return { clean: t.trim(), year: undefined as number | undefined };
}

// --- TMDB matching - ONE API call per film ---
export async function matchWithTmdb(
  entries: FilmEntry[],
  opts?: { language?: string }
): Promise<FilmEntry[]> {
  const language = opts?.language ?? "en-US";

  // Match all films (one API call each)
  const matchResults = await Promise.all(
    entries.map(e => matchOne(peelYear(e.title).clean, language))
  );

  // Build results
  return entries.map((e, i) => {
    const m = matchResults[i];
    const candidates = m.candidates
      .filter(c => c.title && typeof c.tmdb_id === 'number')
      .map(c => ({ 
        title: c.title, 
        tmdbId: c.tmdb_id, 
        releaseYear: c.release_year ?? undefined, 
        summary: c.summary 
      }));

    return {
      ...e,
      title: m.title || e.title,
      tmdbId: m.tmdb_id ?? undefined,
      candidates,
    };
  });
}

// --- Re-match a single film (for retry after editing) ---
export async function rematchSingleFilm(
  entry: FilmEntry,
  opts?: { language?: string }
): Promise<FilmEntry> {
  const language = opts?.language ?? "en-US";
  const { clean } = peelYear(entry.title);

  // Single API call
  const m = await matchOne(clean, language);

  const candidates = m.candidates
    .filter(c => c.title && typeof c.tmdb_id === 'number')
    .map(c => ({
      title: c.title,
      tmdbId: c.tmdb_id,
      releaseYear: c.release_year ?? undefined,
      summary: c.summary
    }));

  return {
    ...entry,
    title: m.title || entry.title,
    tmdbId: m.tmdb_id ?? undefined,
    candidates,
  };
}
