import React from 'react';
import '../styles/About.css';

export const About: React.FC = () => {
    return (
        <div className="about-container">
            <div className="about-content">

                <section className="about-section">
                    <h2>🎬 What is List2Letterboxd?</h2>
                    <p>
                        List2Letterboxd is a web application that converts your film lists and ratings
                        into a format compatible with Letterboxd's import feature. Whether you have
                        ratings in text format, markdown lists, or other formats, this tool helps you
                        migrate your film data seamlessly.
                    </p>
                </section>

                <section className="about-section">
                    <h2>🔄 How It Works</h2>
                    <div className="workflow-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Input Your Data</h3>
                                <p>Paste your film list in the text area. The parser supports various formats including:</p>
                                <ul>
                                    <li>Bullet points with ratings: <code>- Film Title - 4/10</code></li>
                                    <li>Multi-line entries with reviews</li>
                                    <li>Checkbox lists: <code>- [x] Watched Film (5/10)</code></li>
                                    <li>Star ratings: <code>★★★★★ Film Title</code></li>
                                </ul>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Automatic Matching</h3>
                                <p>The system automatically:</p>
                                <ul>
                                    <li>Parses film titles, ratings, and reviews from your text</li>
                                    <li>Matches films with The Movie Database (TMDB) for accurate data</li>
                                    <li>Filters out TV shows (only movies are supported by Letterboxd)</li>
                                    <li>Handles ambiguous matches with a selection interface</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Preview & Edit</h3>
                                <p>Review your data in the preview table where you can:</p>
                                <ul>
                                    <li>Edit film titles if needed</li>
                                    <li>Adjust ratings (0.5-5.0 scale)</li>
                                    <li>Modify reviews and comments</li>
                                    <li>Remove unwanted entries</li>
                                    <li>Choose from multiple film matches when available</li>
                                </ul>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Export to CSV</h3>
                                <p>Download a Letterboxd-compatible CSV file containing:</p>
                                <ul>
                                    <li>TMDB ID for accurate film matching</li>
                                    <li>Canonical film titles</li>
                                    <li>Your ratings (converted to 0.5-5.0 scale)</li>
                                    <li>Reviews with proper HTML formatting</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                 <section className="about-section">
                     <h2>📝 Supported Input Formats</h2>
                     <p>The parser supports various input formats. Here are examples:</p>
                     
                     <div className="format-list">
                         <div className="format-item">
                             <h3>Basic Format</h3>
                             <pre><code>- The Dark Knight - 5/10
- Inception (4.5/10) - Mind-bending thriller
- Pulp Fiction - 5/10 - Tarantino's masterpiece</code></pre>
                         </div>

                         <div className="format-item">
                             <h3>Checkbox Lists</h3>
                             <pre><code>- [x] Interstellar (5/10) - Epic space adventure
- [ ] Unwatched Film (3/10) - Will watch later
- [x] Blade Runner 2049 - 4/10 - Visually stunning</code></pre>
                         </div>

                         <div className="format-item">
                             <h3>Star Ratings</h3>
                             <pre><code>★★★★★ The Godfather
★★★★☆ Goodfellas
★★★☆☆ Average Film</code></pre>
                         </div>
                     </div>
                 </section>

                <section className="about-section">
                    <h2>🎨 Visual Indicators</h2>
                    <div className="indicators">
                        <div className="indicator">
                            <div className="indicator-color green"></div>
                            <div className="indicator-text">
                                <strong>Green Row:</strong> Film successfully matched with TMDB
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="indicator-color yellow"></div>
                            <div className="indicator-text">
                                <strong>Yellow Row:</strong> Multiple matches found - click title to choose
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="indicator-color red"></div>
                            <div className="indicator-text">
                                <strong>Red Row:</strong> No TMDB match found - may need manual correction
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>📊 CSV Output Format</h2>
                    <p>
                        The generated CSV follows Letterboxd's import specification with these columns:
                    </p>
                    <div className="csv-columns">
                        <div className="csv-column">
                            <h4>tmdbID</h4>
                            <p>The Movie Database ID for accurate film matching</p>
                        </div>
                        <div className="csv-column">
                            <h4>Title</h4>
                            <p>Canonical film title from TMDB</p>
                        </div>
                        <div className="csv-column">
                            <h4>Rating</h4>
                            <p>Your rating on a 0.5-5.0 scale</p>
                        </div>
                        <div className="csv-column">
                            <h4>Review</h4>
                            <p>Your review text with HTML formatting (&lt;br&gt; tags for line breaks)</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>🔧 Technical Details</h2>
                    <div className="tech-details">
                        <div className="tech-item">
                            <h3>Film Matching</h3>
                            <p>
                                Uses The Movie Database (TMDB) API for accurate film identification.
                                Only movies are included (TV shows are filtered out automatically).
                            </p>
                        </div>
                        <div className="tech-item">
                            <h3>Data Persistence</h3>
                            <p>
                                Your input and parsed data are automatically saved to browser
                                localStorage, so you won't lose your work when refreshing the page.
                            </p>
                        </div>
                        <div className="tech-item">
                            <h3>CSV Compatibility</h3>
                            <p>
                                Output follows Letterboxd's CSV import format exactly, ensuring
                                seamless data transfer to your Letterboxd account.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>🚀 Getting Started</h2>
                    <ol className="getting-started">
                        <li>Copy your film list from any source (text file, notes app, etc.)</li>
                        <li>Paste it into the text area on the main page</li>
                        <li>Click "Preview" to see parsed results</li>
                        <li>Review and edit the data in the table</li>
                        <li>Click "Download CSV" to get your Letterboxd-compatible file</li>
                        <li>Import the CSV file into Letterboxd using their import feature</li>
                    </ol>
                </section>

                <section className="about-section">
                    <h2>💡 Tips & Best Practices</h2>
                    <ul className="tips">
                        <li><strong>Check your data:</strong> Always review the preview table before downloading</li>
                        <li><strong>Fix unmatched films:</strong> Films in red rows may need manual title correction</li>
                        <li><strong>Use specific titles:</strong> Include release years for better matching (e.g., "Blade Runner (1982)")</li>
                        <li><strong>Backup your work:</strong> The app saves data locally, but keep a copy of your original list</li>
                        <li><strong>Test with small batches:</strong> Try with a few films first to understand the process</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};
