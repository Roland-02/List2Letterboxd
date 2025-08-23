import React, { useState } from 'react';
import { parseFilmText, FilmEntry } from '../components/Parser';
import { generateCSV, downloadCSV } from '../utils/csvGenerator';
import '../styles/Home.css';

export const Home: React.FC = () => {
    const [input, setInput] = useState('');
    const [parsed, setParsed] = useState<FilmEntry[]>([]);

    const handleGenerate = () => {
        const parsedFilms = parseFilmText(input);
        setParsed(parsedFilms);
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
            <button onClick={handleGenerate} className="home-button">
                Preview
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
                            {parsed.map((movie, idx) => (
                                <tr key={idx}>
                                    <td>
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
                            ))}
                        </tbody>

                    </table>

                    <button onClick={handleDownload} className="home-button">
                        Download CSV
                    </button>
                </>
            )}
        </div>
    );
};
