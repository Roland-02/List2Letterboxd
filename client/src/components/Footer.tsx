// src/components/Footer.tsx
import React from 'react';
import { FaGithub } from 'react-icons/fa';

import '../styles/Common.css';

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p className="footer-text">
                <a
                    href="https://github.com/Roland-02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link-group"
                >
                    <span className="footer-link-text">Website developed by Roland Olajide</span>
                    <FaGithub className="footer-icon" />
                </a>
                &nbsp;·&nbsp; Not affiliated with Letterboxd
            </p>
        </footer>
    );
};