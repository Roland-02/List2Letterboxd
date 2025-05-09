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
                rows={6}
                className="home-textarea"
            />
            {/* <button onClick={handleGenerate} className="home-button">
                Create CSV
            </button> */}
            <button onClick={handleGenerate} className="home-button">
                Preview
            </button>
               <ul className="parsed-list">
                {parsed.map((movie, idx) => (
                    <li key={idx}>
                         {movie.title} ({movie.year || 'n/a'}) – {movie.rating10 || 'n/a'}/10
                         {movie.review ? <span> — {movie.review}</span> : null}
                    </li>
                ))}
            </ul>
            {parsed.length > 0 && (
                <button onClick={handleDownload} className="home-button">
                    Download CSV
                </button>
            )}
         
        </div>
    );
};
