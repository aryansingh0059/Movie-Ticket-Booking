import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        // Load initial city
        const city = localStorage.getItem('selectedCity');
        if (city) setSelectedCity(city);

        // Listen for city changes
        const handleStorageChange = () => {
            const updatedCity = localStorage.getItem('selectedCity');
            setSelectedCity(updatedCity || '');
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event for same-tab updates
        window.addEventListener('cityChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cityChanged', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCityClick = () => {
        // Clear city and trigger modal
        localStorage.removeItem('selectedCity');
        setSelectedCity('');
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('cityChanged'));
        // Navigate to home if not already there
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            // Reload to show modal
            window.location.reload();
        }
    };

    // Don't show header on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <span className="logo-text">CineVerse</span>
                    </Link>

                    <nav className="nav">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>

                        <Link to="/movies" className="nav-link">
                            Movies
                        </Link>

                        <Link to="/about" className="nav-link">
                            About
                        </Link>

                        {selectedCity && (
                            <button className="location-btn" onClick={handleCityClick}>
                                📍 {selectedCity}
                            </button>
                        )}

                        {isAuthenticated ? (
                            <div className="user-menu">
                                <Link to="/my-bookings" className="nav-link">
                                    My Bookings
                                </Link>
                                <span className="user-name">
                                    👤 {currentUser?.name}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-register">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
