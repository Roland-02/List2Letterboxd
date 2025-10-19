import React, { useState } from 'react';
import { parseFilmText, FilmEntry, matchWithTmdb} from '../components/Parser';
import { generateCSV, downloadCSV } from '../utils/csvGenerator';
import '../styles/Home.css';

export const Home: React.FC = () => {
    const [input, setInput] = useState('');
    const [parsed, setParsed] = useState<FilmEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [pickerIndex, setPickerIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const parsedFilms = parseFilmText(input);
            const enriched = await matchWithTmdb(parsedFilms);
            setParsed(enriched);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const csv = generateCSV(parsed);
        downloadCSV(csv);
    };


    return (
        <div className="home-container">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your films and ratings here..."
                className="home-textarea"
            />

            <button onClick={handleGenerate} className="home-button" disabled={loading}>
                {loading ? 'Parsing...' : 'Preview'}
            </button>

            {parsed.length > 0 && (
                <>
                    <table className="preview-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Rating</th>
                                <th>Review</th>
                                <th>Liked</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parsed.map((movie, idx) => {
                                const hasMultipleCandidates = (movie.candidates?.length || 0) > 1;
                                const isAmbiguous = hasMultipleCandidates && !movie.tmdbId;
                                return (
                                <tr key={idx} className={isAmbiguous ? 'row-ambiguous' : undefined}>
                                    <td>
                                        {hasMultipleCandidates ? (
                                            <button
                                              type="button"
                                              className="title-button"
                                              onClick={() => setPickerIndex(idx)}
                                              title="Multiple matches found. Click to choose."
                                            >
                                              {movie.title}
                                            </button>
                                        ) : (
                                            <input
                                                type="text"
                                                value={movie.title}
                                                onChange={(e) => {
                                                    const updated = [...parsed];
                                                    updated[idx].title = e.target.value;
                                                    setParsed(updated);
                                                }}
                                                className="cell-input"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="5"
                                            value={movie.rating !== undefined ? movie.rating : ''}
                                            onChange={(e) => {
                                                const updated = [...parsed];
                                                const value = e.target.value;
                                                updated[idx].rating = value ? parseFloat(value) : undefined;
                                                setParsed(updated);
                                            }}
                                            className="cell-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={movie.review || ''}
                                            onChange={(e) => {
                                                const updated = [...parsed];
                                                updated[idx].review = e.target.value;
                                                setParsed(updated);
                                            }}
                                            className="cell-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={movie.liked || false}
                                            onChange={(e) => {
                                                const updated = [...parsed];
                                                updated[idx].liked = e.target.checked;
                                                setParsed(updated);
                                            }}
                                            className="cell-input"
                                        />
                                    </td>
                                </tr>
                            );})}
                        </tbody>

                    </table>

                    <button onClick={handleDownload} className="home-button">
                        Download CSV
                    </button>

                    {pickerIndex !== null && (
                      <div className="modal-backdrop" onClick={() => setPickerIndex(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                          <h3>Pick the correct title</h3>
                          <ul className="candidate-list">
                            {(parsed[pickerIndex].candidates || []).map((c) => (
                              <li key={c.tmdbId}>
                                <button
                                  type="button"
                                  className="candidate-button"
                                  onClick={() => {
                                    const updated = [...parsed];
                                    updated[pickerIndex].title = c.title + (c.releaseYear ? ` (${c.releaseYear})` : '');
                                    updated[pickerIndex].tmdbId = c.tmdbId;
                                    setParsed(updated);
                                    setPickerIndex(null);
                                  }}
                                >
                                  {c.title}{c.releaseYear ? ` (${c.releaseYear})` : ''}
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="modal-actions">
                            <button type="button" className="home-button" onClick={() => setPickerIndex(null)}>Close</button>
                          </div>
                        </div>
                      </div>
                    )}
                </>
            )}
        </div>
    );
};
