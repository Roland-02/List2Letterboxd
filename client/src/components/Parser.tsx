export type FilmEntry = {
  title: string;
  rating?: number; // normalized to /5 with .5 steps (e.g. 7/10 -> 3.5)
  review?: string;
  liked?: boolean; // intentionally unused/left blank
};

export function parseFilmText(input: string): FilmEntry[] {
  const lines = input
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const results: FilmEntry[] = [];

  for (let line of lines) {
    // 0) Strip bullets/checkboxes ONLY (don't infer "liked")
    line = line.replace(
      /^\s*(?:[-*•]+|\d+[.)])?\s*(?:\[(?:x|X|✓|✔|\s)?\]|[✓✔✅☑️])?\s*/,
      ""
    );

    const entry: FilmEntry = { title: "" };

    // 1) Find rating candidates with their positions
    //    (a) 7/10, 4.5/5, 87/100 (optionally in parentheses)
    const reSlash = /(\()?\s*(\d+(?:\.\d+)?)\s*\/\s*(100|10|5)\s*(\))?/;
    const mSlash = reSlash.exec(line);

    //    (b) ★★★★½ or ⭐⭐⭐⭐ with optional half
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
      const r10 = roundHalf(stars * 2); // /5 -> /10
      // prefer whichever rating appears earlier in the line
      if (!chosen || start < chosen.start) {
        chosen = { start, end, rating10: r10 };
      }
    }

    // 2) If we got a rating, set it (normalize to /5 with halves) and
    //    use its position to split the title/review.
    if (chosen) {
      entry.rating = roundHalf(chosen.rating10 / 2); // /10 -> /5

      const before = line.slice(0, chosen.start);
      const after = line.slice(chosen.end);

      const stripEdgeDelims = (s: string) => s
          // remove "empty" parentheses that can remain after cutting out rating
          .replace(/\(\s*\)\s*/g, " ")
          // trim delimiters at the edges ONLY (keep colons/slashes inside titles)
          .replace(/^\s*[-–—:|,.;]+/, "")
          .replace(/[-–—:|,.;]+\s*$/, "")
          .trim();

      entry.title = stripEdgeDelims(before);
      const review = stripEdgeDelims(after);
      if (review) entry.review = review;

      // Fallback: if rating came first and title ended empty, grab a sensible title
      if (!entry.title) {
        const m = after.match(/^\s*(.+?)(?:\s(?:-|–|—|\|)\s|$)/);
        entry.title = (m?.[1] ?? after).trim();
        const rest = after.slice(m?.[0]?.length ?? 0).trim();
        if (rest) entry.review = stripEdgeDelims(rest);
      }
    } else {
      // 3) No rating found -> keep whole line as title; no review.
      entry.title = line;
    }

    if (entry.title) results.push(entry);
  }

  return results;
}
