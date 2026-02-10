import { useState, useEffect } from 'react';
import StorageService from '../utils/StorageService';
import MovieCard from '../components/MovieCard';
import './Dashboard.css';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Load movies and cities
        const allMovies = StorageService.getMovies();
        const allCities = StorageService.getCitiesFromMovies();

        setMovies(allMovies);
        setFilteredMovies(allMovies);
        setCities(allCities);
    }, []);

    useEffect(() => {
        // Apply filters
        let filtered = movies;

        // Filter by city
        if (selectedCity) {
            filtered = filtered.filter(movie =>
                movie.cities.includes(selectedCity)
            );
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredMovies(filtered);
    }, [selectedCity, searchQuery, movies]);

    return (
        <div className="page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Recommended Movies</h1>
                    <p className="text-secondary">Book your favorite movies now</p>
                </div>

                <div className="filters fade-in">
                    <div className="filter-group">
                        <label className="filter-label">🏙️ Filter by City</label>
                        <select
                            className="filter-select"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">🔍 Search Movies</label>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Search by movie name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {filteredMovies.length === 0 ? (
                    <div className="no-results">
                        <h2>😔 No movies found</h2>
                        <p className="text-secondary">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="movies-grid">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
