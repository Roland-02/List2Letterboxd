export type FilmEntry = {
    title: string;
    year?: string;
    rating10?: number;
    review?: string;
  };
  
  export function parseFilmText(input: string): FilmEntry[] {
    const lines = input
      .split(/\n|(?<=\])\s*-\s*/) // also splits giant in-line " - [ ] Title" formats
      .map(line => line.trim())
      .filter(Boolean); // remove empty lines
  
    const results: FilmEntry[] = [];
  
    for (let raw of lines) {
      let line = raw;
  
      // Strip markdown checkboxes, bullets, numbers, emojis, etc.
      line = line.replace(/^[-*•\d.()\[\]\s]+/, '').trim();
  
      const entry: FilmEntry = {
          title: ""
      };
  
      // Extract optional year
      const yearMatch = line.match(/\((\d{4})\)/);
      if (yearMatch) {
        entry.year = yearMatch[1];
      }
  
      // Extract rating
      const rating10Match = line.match(/(\d(?:\.\d)?)\/10/);
      const rating5Match = line.match(/(\d(?:\.\d)?)\/5/);
      const starsMatch = line.match(/★{1,5}(½)?/);
  
      if (rating10Match) {
        entry.rating10 = parseFloat(rating10Match[1]);
      } else if (rating5Match) {
        entry.rating10 = parseFloat(rating5Match[1]) * 2;
      } else if (starsMatch) {
        const stars = (starsMatch[0].match(/★/g)?.length || 0) + (starsMatch[1] ? 0.5 : 0);
        entry.rating10 = stars * 2;
      }
  
      // Remove year/rating from title
      let title = line.replace(/\(\d{4}\)/, '').replace(/(\d+\/10|\d+\/5|★+)/, '').trim();
  
      // Final title cleanup
      entry.title = title.replace(/^[-–:]+/, '').trim();
  
      if (entry.title.length > 0) {
        results.push(entry);
      }
    }
  
    return results;
  }
  