import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StorageService from '../utils/StorageService';
import './CinemaListing.css';

const CinemaListing = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cinemas, setCinemas] = useState([]);

    useEffect(() => {
        const movieData = StorageService.getMovieById(movieId);
        setMovie(movieData);

        if (movieData) {
            // Get selected city from localStorage
            const selectedCity = localStorage.getItem('selectedCity');

            // Load cinemas for this movie and city
            const filteredCinemas = StorageService.getCinemasForMovie(movieId, selectedCity);
            setCinemas(filteredCinemas);

        }
    }, [movieId]);

    const handleCinemaClick = (cinemaId) => {
        navigate(`/movie/${movieId}/cinema/${cinemaId}/showtimes`);
    };

    if (!movie) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="page">
            <div className="container">
                <div className="cinema-header fade-in">
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Back to Movies
                    </button>

                    <div className="movie-banner">
                        <img src={movie.poster} alt={movie.title} className="banner-poster" />
                        <div className="banner-info">
                            <h1>{movie.title}</h1>
                            <div className="banner-meta">
                                <span>📅 {movie.year}</span>
                                <span>⭐ {movie.rating}</span>
                                <span>🗣️ {movie.language}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cinema-filters fade-in">
                    <h2>Select Cinema</h2>
                </div>

                {cinemas.length === 0 ? (
                    <div className="no-results">
                        <h2>😔 No cinemas found</h2>
                        <p className="text-secondary">Try checking back later</p>
                    </div>
                ) : (
                    <div className="cinemas-grid">
                        {cinemas.map(cinema => (
                            <div
                                key={cinema.id}
                                className="cinema-card fade-in"
                                onClick={() => handleCinemaClick(cinema.id)}
                            >
                                <div className="cinema-icon">🎭</div>
                                <div className="cinema-details">
                                    <h3 className="cinema-name">{cinema.name}</h3>
                                    <p className="cinema-location">📍 {cinema.location}</p>
                                    <p className="cinema-city">🏙️ {cinema.city}</p>
                                </div>
                                <button className="btn-select">Select →</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CinemaListing;
