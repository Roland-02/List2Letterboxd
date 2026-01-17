import React from 'react';
import '../styles/About.css';

export const About: React.FC = () => {
    return (
        <div className="about-container">
            <div className="about-content">

                <section className="about-section">
                    <h2>What is List2Letterboxd?</h2>
                    <p>
                        List2Letterboxd converts your film lists and ratings into a CSV file 
                        compatible with Letterboxd's import feature. Paste your ratings from 
                        text files, notes apps, or anywhere else, and get a ready-to-import file.
                    </p>
                </section>

                <section className="about-section">
                    <h2>How It Works</h2>
                    <div className="workflow-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Paste Your List</h3>
                                <p>Paste your film ratings in any format:</p>
                                <ul>
                                    <li><code>- Film Title - 8/10</code></li>
                                    <li><code>- Film Title (4/5) - Great movie!</code></li>
                                    <li><code>★★★★☆ Film Title</code></li>
                                </ul>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Preview & Match</h3>
                                <p>Click "Preview" to parse your list. Each film is matched with TMDB to get the correct title and ID.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Review & Edit</h3>
                                <p>Check the results table. You can edit titles, ratings, and reviews. Use the 🔄 button to retry unmatched films.</p>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Download CSV</h3>
                                <p>Click "Download CSV" and import the file at <a href="https://letterboxd.com/import/" target="_blank" rel="noopener noreferrer">letterboxd.com/import</a></p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Supported Formats</h2>
                    <p>The parser handles various input styles:</p>
                    
                    <div className="format-list">
                        <div className="format-item">
                            <h3>Ratings out of 10, 5, or 100</h3>
                            <pre><code>- The Dark Knight - 9/10
- Inception (4.5/5) - Mind-bending
- Pulp Fiction - 85/100</code></pre>
                        </div>

                        <div className="format-item">
                            <h3>Star Ratings</h3>
                            <pre><code>★★★★★ The Godfather
★★★★☆ Goodfellas
★★★☆☆ Average Film</code></pre>
                        </div>

                        <div className="format-item">
                            <h3>With Reviews</h3>
                            <pre><code>- Interstellar (5/5) - Epic space adventure, loved the score
- Blade Runner 2049 - 4/5 - Visually stunning sequel</code></pre>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Row Colors</h2>
                    <div className="indicators">
                        <div className="indicator">
                            <div className="indicator-color yellow"></div>
                            <div className="indicator-text">
                                <strong>Yellow:</strong> Multiple matches - click title to choose
                            </div>
                        </div>
                        <div className="indicator">
                            <div className="indicator-color red"></div>
                            <div className="indicator-text">
                                <strong>Red:</strong> No match - edit title and click 🔄 to retry
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>CSV Output</h2>
                    <p>The generated CSV includes:</p>
                    <div className="csv-columns">
                        <div className="csv-column">
                            <h4>tmdbID</h4>
                            <p>TMDB ID for accurate matching</p>
                        </div>
                        <div className="csv-column">
                            <h4>Title</h4>
                            <p>Official film title</p>
                        </div>
                        <div className="csv-column">
                            <h4>Rating</h4>
                            <p>Your rating (0.5-5.0)</p>
                        </div>
                        <div className="csv-column">
                            <h4>Review</h4>
                            <p>Your review text</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Tips</h2>
                    <ul className="tips">
                        <li><strong>Include release years</strong> for better matching: "Blade Runner (1982)"</li>
                        <li><strong>Check red rows</strong> - fix the title and click 🔄 to retry</li>
                        <li><strong>Your data is saved</strong> locally - refresh won't lose your work</li>
                        <li><strong>Only matched films</strong> (with TMDB ID) are included in the CSV</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};
