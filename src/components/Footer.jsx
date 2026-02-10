import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-top-section">
                <div className="footer-links-grid">
                    <div className="footer-column brand-column">
                        <h3>CineVerse</h3>
                        <p>Your Gateway to Cinematic Excellence</p>
                    </div>
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/movies">Movies</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Legal</h3>
                        <ul>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-line-container">
                    <div className="line-wrapper"></div>
                    <div className="brand-logo-wrapper">
                        <span className="logo-text">CineVerse</span>
                    </div>
                    <div className="line-wrapper"></div>
                </div>
            </div>

            <div className="container footer-content-centered">
                <div className="social-icons-row">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                        <span className="icon-circle">𝕏</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                        <span className="icon-circle">📸</span>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                        <span className="icon-circle">in</span>
                    </a>
                </div>

                <div className="footer-copyright">
                    <p>Copyright {new Date().getFullYear()} © CineVerse Pvt. Ltd. All Rights Reserved.</p>
                    <p className="footer-disclaimer">
                        The content and images used on this site are copyright protected and copyrights vests with the respective owners.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
