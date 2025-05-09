// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import { SiLetterboxd } from 'react-icons/si';

import '../styles/Common.css';

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">

            <Link to="/about" className="navbar-link">
                <FiIcons.FiInfo className="navbar-icon" />
            </Link>

            <Link to="/" className="navbar-title">
                Letterboxd CSV
            </Link>

            <a href="https://letterboxd.com/import/" target="_blank" rel="noopener noreferrer" className="navbar-link">
                <SiLetterboxd className="navbar-icon" />
            </a>

        </nav>
    );
};
