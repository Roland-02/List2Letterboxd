import { FilmEntry } from '../components/Parser';

export function generateCSV(data: FilmEntry[]): string {
  const header = ['Title', 'Rating', 'Review', 'Liked'];
  const rows = data.map((film) => [
    escapeCSV(film.title),
    film.rating?.toString() || '',
    escapeCSV(film.review || ''),
  ]);

  return [header, ...rows].map((row) => row.join(',')).join('\n');
}

function escapeCSV(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '\\"')}"`;
  }
  return text;
}

export function downloadCSV(csv: string, filename = 'letterboxd-import.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
  URL.revokeObjectURL(url);
}