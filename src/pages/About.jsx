import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to CineVerse</h1>
                    <p className="hero-subtitle">Your Gateway to Cinematic Excellence</p>
                    <div className="hero-decoration">
                        <span className="decoration-icon">🎬</span>
                        <span className="decoration-icon">🍿</span>
                        <span className="decoration-icon">🎭</span>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="our-story">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2 className="section-title">Our Story</h2>
                            <p className="story-paragraph">
                                CineVerse was born from a simple idea: movie booking should be as enjoyable as watching the movie itself.
                                We're passionate about cinema and believe that every movie-goer deserves a seamless, delightful booking experience.
                            </p>
                            <p className="story-paragraph">
                                From the latest blockbusters to timeless classics, from Hollywood to Bollywood, we bring you the best of cinema
                                at your fingertips. Our platform connects you with premium theaters across India, making it easier than ever
                                to plan your perfect movie night.
                            </p>
                            <p className="story-paragraph">
                                With CineVerse, you're not just booking tickets – you're stepping into a world where entertainment meets innovation,
                                where convenience meets quality, and where every visit is an experience to remember.
                            </p>
                        </div>
                        <div className="story-image">
                            <div className="image-placeholder">
                                <span className="placeholder-icon">🎥</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision">
                <div className="container">
                    <div className="mv-grid">
                        <div className="mv-card mission-card">
                            <div className="mv-icon">🎯</div>
                            <h3 className="mv-title">Our Mission</h3>
                            <p className="mv-text">
                                To revolutionize the movie-going experience by providing a seamless, user-friendly platform
                                that makes booking tickets effortless and enjoyable for everyone.
                            </p>
                        </div>

                        <div className="mv-card vision-card">
                            <div className="mv-icon">🌟</div>
                            <h3 className="mv-title">Our Vision</h3>
                            <p className="mv-text">
                                To become India's most trusted and loved entertainment platform, connecting millions of
                                movie lovers with unforgettable cinematic experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="statistics">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Movies Available</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Cities Covered</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-number">1M+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-number">200+</div>
                            <div className="stat-label">Theater Partners</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Experience CineVerse?</h2>
                        <p className="cta-text">
                            Join millions of movie lovers and start booking your tickets today!
                        </p>
                        <div className="cta-buttons">
                            <Link to="/" className="btn-primary">
                                Browse Movies
                            </Link>
                            <Link to="/register" className="btn-secondary">
                                Sign Up Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
