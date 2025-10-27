import { FilmEntry } from '../components/Parser';

export function generateCSV(data: FilmEntry[]): string {
  const header = ['tmdbID', 'Title', 'Rating', 'Review'];
  
  // Filter out entries without tmdbId
  const validFilms = data.filter(film => film.tmdbId);
  
  const rows = validFilms.map((film) => [
    film.tmdbId?.toString() || '',
    escapeCSV(film.title),
    film.rating?.toString() || '',
    escapeCSV(convertToHTML(film.review || '')),
  ]);

  return [header, ...rows].map((row) => row.join(',')).join('\n');
}

function convertToHTML(text: string): string {
  if (!text) return '';
  
  // Convert line breaks to HTML <br> tags
  // Handle both \n and \r\n line endings
  return text
    .replace(/\r\n/g, '<br>')
    .replace(/\n/g, '<br>')
    .trim();
}

function escapeCSV(text: string): string {
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    // Escape quotes by doubling them (CSV standard)
    return `"${text.replace(/"/g, '""')}"`;
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