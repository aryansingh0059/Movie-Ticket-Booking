import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    return (
        <div className="movie-card fade-in" onClick={handleClick}>
            <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} />
                <div className="movie-overlay">
                    <button className="btn-book">Book Now</button>
                </div>
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">📅 {movie.year}</span>
                    <span className="movie-rating">⭐ {movie.rating}</span>
                </div>
                <div className="movie-language">🗣️ {movie.language}</div>
            </div>
        </div>
    );
};

export default MovieCard;
