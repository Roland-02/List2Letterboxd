import React, { useState } from 'react';

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
    <div className="p-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste film ratings here"
        rows={5}
        className="w-full border p-2"
      />
      <button onClick={parseText} className="mt-2 px-4 py-2 bg-blue-500 text-white">
        Parse
      </button>
      <ul>
        {parsed.map((movie, idx) => (
          <li key={idx}>
            {movie.title} - {movie.rating}/10
          </li>
        ))}
      </ul>
    </div>
  );
};
