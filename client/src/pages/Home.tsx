import React, { useState } from 'react';
import '../styles/Home.css';

export const Home: React.FC = () => {
    const [input, setInput] = useState('');
    const [parsed, setParsed] = useState<{ title: string; rating: number }[]>([]);

    const parseText = () => {
        const pattern = /([^\(\-:,]+)[\s\-:]*\(?(\d+(?:\.\d+)?)\/10\)?/gi;
        const results = Array.from(input.matchAll(pattern)).map(([, title, rating]) => ({
            title: title.trim(),
            rating: parseFloat(rating),
        }));
        setParsed(results);
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
            <button onClick={parseText} className="home-button">
                Submit
            </button>
            <ul className="parsed-list">
                {parsed.map((movie, idx) => (
                    <li key={idx}>
                        {movie.title} - {movie.rating}/10
                    </li>
                ))}
            </ul>
        </div>
    );
};
