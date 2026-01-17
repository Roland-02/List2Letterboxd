# List2Letterboxd

Convert your film lists and ratings into a CSV file compatible with [Letterboxd's import feature](https://letterboxd.com/import/).

## Features

- **Flexible Input Parsing** - Supports various rating formats (x/10, x/5, x/100, star ratings)
- **TMDB Integration** - Automatically matches films with The Movie Database for accurate titles and IDs
- **Editable Preview** - Review and edit titles, ratings, and reviews before export
- **Ambiguous Match Handling** - Choose from multiple matches when a title is unclear
- **Retry Unmatched Films** - Edit titles and retry search for films that weren't found
- **Local Storage** - Your data persists across browser sessions
- **Letterboxd-Ready CSV** - Export includes tmdbID, Title, Rating, and Review columns

## Supported Input Formats

```
- The Dark Knight - 9/10
- Inception (4.5/5) - Mind-bending thriller
- Pulp Fiction - 85/100
★★★★★ The Godfather
★★★★☆ Goodfellas
- Interstellar (5/5) - Epic space adventure
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- TMDB API Read Access Token ([get one here](https://www.themoviedb.org/settings/api))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/List2Letterboxd.git
   cd List2Letterboxd/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   echo "REACT_APP_TMDB_TOKEN=your_tmdb_token_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push your code to GitHub

2. Import project on [vercel.com](https://vercel.com)

3. Configure settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. Add environment variable:
   - `REACT_APP_TMDB_TOKEN` = your TMDB token

5. Deploy!

## Usage

1. **Paste** your film list into the text area
2. Click **Preview** to parse and match films with TMDB
3. **Review** the results:
   - ⬜ White rows = matched successfully
   - 🟨 Yellow rows = multiple matches (click to choose)
   - 🟥 Red rows = no match (edit title and click 🔄 to retry)
4. **Edit** titles, ratings, or reviews as needed
5. Click **Download CSV**
6. Import at [letterboxd.com/import](https://letterboxd.com/import/)

## CSV Output Format

| Column | Description |
|--------|-------------|
| tmdbID | The Movie Database ID |
| Title | Official film title |
| Rating | Your rating (0.5-5.0 scale) |
| Review | Your review text |

## Tech Stack

- React (Create React App)
- TypeScript
- TMDB API

## License

MIT

## Disclaimer

Not affiliated with Letterboxd.com or TMDB.
