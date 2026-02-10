import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StorageService from '../utils/StorageService';
import './MovieDetails.css';

const MovieDetails = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieData = async () => {
            setLoading(true);
            try {
                // Get movie by ID from StorageService
                const movieData = StorageService.getMovieById(movieId);
                if (movieData) {
                    setMovie(movieData);
                } else {
                    console.error('Movie not found');
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
        window.scrollTo(0, 0);
    }, [movieId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="error-container">
                <h2>🎬 Movie not found</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
            </div>
        );
    }

    const handleBookTickets = () => {
        navigate(`/movie/${movie.id}/cinemas`);
    };

    return (
        <div className="movie-details-page">
            {/* Hero Section */}
            <div className="movie-hero">
                <div
                    className="hero-backdrop"
                    style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
                ></div>
                <div className="hero-overlay"></div>

                <div className="container hero-content">
                    <div className="movie-poster-section">
                        <div className="poster-wrapper">
                            <img src={movie.poster} alt={movie.title} className="detail-poster" />
                            <div className="poster-overlay">
                                <button className="btn-trailer">
                                    <span className="play-icon">▶</span> Trailer
                                </button>
                            </div>
                            <div className="poster-status">In cinemas</div>
                        </div>
                    </div>

                    <div className="movie-info-section">


                        <h1 className="movie-detail-title">{movie.title}</h1>

                        <div className="rating-box">
                            <div className="rating-info">
                                <span className="star-icon">⭐</span>
                                <span className="rating-value">{movie.rating}/10</span>
                                <span className="vote-count">({movie.voteCount >= 1000 ? `${(movie.voteCount / 1000).toFixed(1)}K` : movie.voteCount}+ Votes)</span>
                                <span className="arrow">›</span>
                            </div>
                            <button className="btn-rate">Rate now</button>
                        </div>

                        <div className="movie-meta-details">
                            <span className="meta-info">{movie.runtime || '2h 11m'}</span>
                            <span className="dot">•</span>
                            <span className="meta-info">{movie.genre || 'Action, Drama, Thriller'}</span>
                            <span className="dot">•</span>
                            <span className="meta-info">{movie.certification || 'UA16+'}</span>
                            <span className="dot">•</span>
                            <span className="meta-info">
                                {movie.releaseDate || (movie.year ? `1 Jan, ${movie.year}` : 'Coming Soon')}
                            </span>
                        </div>

                        <div className="format-chips">
                            <span className="chip">2D</span>
                            <span className="chip">{movie.language || 'Hindi'}</span>
                        </div>

                        <button className="btn-book-tickets" onClick={handleBookTickets}>
                            Book tickets
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="movie-content-section">
                <div className="container">
                    <div className="content-layout">
                        <div className="main-content">
                            <div className="about-section">
                                <h2 className="section-heading">About the movie</h2>
                                <p className="movie-plot">
                                    {movie.plot || "A police officer's pursuit of truth in a shocking prison crime intertwines with the lives of a widowed prison guard and a soon to be released inmate, unravelling a web of morality and redemption."}
                                </p>
                            </div>

                            {/* Reviews Section */}
                            <div className="reviews-section">
                                <div className="reviews-header">
                                    <h2 className="section-heading">Top reviews</h2>
                                    <button className="btn-all-reviews">
                                        {(movie.vote_count * 5).toLocaleString() || '50.4K'} reviews <span>›</span>
                                    </button>
                                </div>
                                <p className="reviews-summary">Summary of {(movie.vote_count * 5).toLocaleString() || '50.4K'} reviews.</p>

                                <div className="review-tags">
                                    {[
                                        { label: '#Blockbuster', count: 22997 },
                                        { label: '#GreatActing', count: 21796 },
                                        { label: '#Inspiring', count: 21631 },
                                        { label: '#SuperDirection', count: 19773 },
                                        { label: '#WellWritten', count: 18500 }
                                    ].map((tag, idx) => (
                                        <div key={idx} className="review-tag">
                                            <span className="tag-label">{tag.label}</span>
                                            <span className="tag-count">{tag.count}</span>
                                        </div>
                                    ))}
                                    <div className="tag-scroll-btn">›</div>
                                </div>

                                <div className="reviews-grid-scroll">
                                    {[
                                        {
                                            user: 'User',
                                            rating: '10/10',
                                            tags: '#SuperDirection #GreatActing #Blockbuster',
                                            date: '17 Days ago'
                                        },
                                        {
                                            user: 'User',
                                            rating: '10/10',
                                            text: 'यह फिल्म सिर्फ एक फिल्म नहीं, बल्कि एक एहसास है। सनी देओल पाजी की एंट्री से लेकर आखिरी सीन तक, यह फिल्म आपको अपनी सीट से बांधे रखती है...more',
                                            date: '17 Days ago'
                                        },
                                        {
                                            user: 'User',
                                            rating: '9/10',
                                            tags: '#OneTimeWatch #GreatActing',
                                            date: '20 Days ago'
                                        }
                                    ].map((review, idx) => (
                                        <div key={idx} className="review-card">
                                            <div className="review-card-header">
                                                <div className="user-profile">
                                                    <div className="user-avatar">👤</div>
                                                    <div className="user-details">
                                                        <span className="user-name">{review.user}</span>
                                                        <span className="booked-on">Booked on <span className="brand-red">cine</span>verse</span>
                                                    </div>
                                                </div>
                                                <div className="review-card-rating">
                                                    <span className="star-red">⭐</span> {review.rating}
                                                </div>
                                            </div>
                                            <div className="review-card-body">
                                                {review.tags && <p className="review-tags-text">{review.tags}</p>}
                                                {review.text && <p className="review-main-text">{review.text}</p>}
                                            </div>
                                            <div className="review-card-footer">
                                                <div className="review-actions">
                                                    <button className="btn-action">👍 3K</button>
                                                    <button className="btn-action">👎</button>
                                                </div>
                                                <div className="review-meta">
                                                    <span>{review.date}</span>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MovieDetails;
