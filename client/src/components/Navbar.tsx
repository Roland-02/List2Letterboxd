// src/components/Navbar.tsx
import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import { SiLetterboxd } from 'react-icons/si';

import '../styles/Common.css';

export const Navbar: React.FC = () => {
    const [signedIn, setSignedIn] = useState(false);

    const toggleSignIn = () => {
        setSignedIn((prev) => !prev);
    };

    return (
        <nav className="navbar">

            <button onClick={toggleSignIn} className="navbar-button" title={signedIn ? 'Sign out' : 'Sign in'}>
                {signedIn ? <FiIcons.FiLogOut className="navbar-icon" /> : <FiIcons.FiLogIn className="navbar-icon" />}
            </button>

            <div className="navbar-title">Letterboxd Importer</div>

            <a
                href="https://letterboxd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="navbar-link"
            >
                <SiLetterboxd className="navbar-icon" />
            </a>


        </nav>
    );
};
