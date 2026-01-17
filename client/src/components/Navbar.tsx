import React from 'react';
import { Link } from 'react-router-dom';
import { FiInfo } from 'react-icons/fi';
import { SiLetterboxd } from 'react-icons/si';
import '../styles/Common.css';

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <Link to="/about" className="navbar-link">
                <FiInfo className="navbar-icon" />
            </Link>

            <Link to="/" className="navbar-title">
                List2Letterboxd
            </Link>

            <a href="https://letterboxd.com/import/" target="_blank" rel="noopener noreferrer" className="navbar-link">
                <SiLetterboxd className="navbar-icon" />
            </a>

        </nav>
    );
};
