import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StorageService from '../utils/StorageService';
import Banner from '../components/Banner';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const moviesScrollRef = useRef(null);

    const topCities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chandigarh', 'Chennai', 'Pune', 'Kolkata', 'Kochi'
    ];

    const otherCities = [
        'Agra', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Ambattur', 'Amravati', 'Amritsar', 'Asansol', 'Aurangabad',
        'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner',
        'Coimbatore', 'Cuttack', 'Dehradun', 'Dhanbad', 'Durgapur', 'Erode', 'Faridabad', 'Firozabad',
        'Gaya', 'Ghaziabad', 'Gulbarga', 'Guntur', 'Guwahati', 'Gwalior', 'Howrah', 'Hubli-Dharwad',
        'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jalgaon', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur',
        'Kalyan-Dombivali', 'Kanpur', 'Kolhapur', 'Kota', 'Loni', 'Lucknow', 'Ludhiana', 'Madurai', 'Maheshtala', 'Malegaon',
        'Mangalore', 'Meerut', 'Mira-Bhayandar', 'Moradabad', 'Mysore', 'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore',
        'Noida', 'Patna', 'Raipur', 'Rajkot', 'Ranchi', 'Rourkela', 'Saharanpur', 'Salem', 'Sangli-Miraj-Kupwad', 'Siliguri',
        'Solapur', 'Srinagar', 'Surat', 'Thane', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur',
        'Udaipur', 'Ujjain', 'Ulhasnagar', 'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vijayawada', 'Visakhapatnam', 'Warangal'
    ].sort();

    const allCities = [...topCities, ...otherCities];

    useEffect(() => {
        // Check if location is already selected
        const savedLocation = localStorage.getItem('selectedCity');
        if (!savedLocation) {
            setShowLocationModal(true);
        } else {
            setSelectedCity(savedLocation);
        }

        // Load featured movies (get more movies)
        const movies = StorageService.getMovies();
        setFeaturedMovies(movies.slice(0, 12));
    }, []);



    // Filter logic
    const isSearching = searchQuery.length > 0;
    const filteredTopCities = topCities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredOtherCities = otherCities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleLocationSelect = (city, e) => {
        if (e) e.preventDefault();

        try {
            setSelectedCity(city);
            localStorage.setItem('selectedCity', city);
            setShowLocationModal(false);
            // Dispatch custom event to notify Header
            window.dispatchEvent(new Event('cityChanged'));

        } catch (error) {
            console.error('Error selecting location:', error);
        }
    };

    const handleDetectLocation = async () => {
        setIsDetectingLocation(true);

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            setIsDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;


                try {
                    // Use reverse geocoding to get city name
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    // Extract city from response
                    const detectedCity = data.address.city || data.address.town || data.address.state_district;


                    // Find closest match in our cities list
                    const cityMatch = allCities.find(city =>
                        city.toLowerCase() === detectedCity?.toLowerCase()
                    );

                    if (cityMatch) {
                        handleLocationSelect(cityMatch);
                    } else {
                        // Keep modal open and let user select manually
                        alert(`We detected you're in ${detectedCity || 'your area'}, but this city is not available yet. Please select from the available cities below.`);
                        setIsDetectingLocation(false);
                    }
                } catch (error) {
                    console.error('Error detecting location:', error);
                    alert('Could not detect your location. Please select your city manually from the list below.');
                    setIsDetectingLocation(false);
                }
            },
            (error) => {

                alert('Location permission denied. Please select your city manually from the list below.');
                setIsDetectingLocation(false);
            }
        );
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="home-page">
            {/* Location Modal */}
            {showLocationModal && (
                <div className="location-modal-overlay">
                    <div className="location-modal">
                        <h2>📍 Select Your City</h2>
                        <p>Choose your location to see movies and showtimes near you</p>

                        {/* Search Input */}
                        <div className="location-search">
                            <input
                                type="text"
                                placeholder="Search for your city"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="location-search-input"
                            />
                        </div>

                        {/* Detect Location Button */}
                        <button
                            className="detect-location-btn"
                            onClick={handleDetectLocation}
                            disabled={isDetectingLocation}
                        >
                            {isDetectingLocation ? (
                                <>🔄 Detecting...</>
                            ) : (
                                <>📍 Detect my location</>
                            )}
                        </button>

                        <div className="cities-scroll-container">
                            {/* Top Cities Section */}
                            {(isSearching ? filteredTopCities.length > 0 : true) && (
                                <div className="cities-section">
                                    <h3 className="cities-section-title">Popular Cities</h3>
                                    <div className="cities-grid top-cities-grid">
                                        {(isSearching ? filteredTopCities : topCities).map(city => (
                                            <button
                                                key={city}
                                                className="city-button top-city-button"
                                                onClick={() => handleLocationSelect(city)}
                                            >
                                                <div className="city-icon-wrapper">
                                                    <span className="city-icon">🏙️</span>
                                                </div>
                                                <span className="city-name">{city}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Cities Section */}
                            {(isSearching ? filteredOtherCities.length > 0 : true) && (
                                <div className="cities-section">
                                    <h3 className="cities-section-title">Other Cities</h3>
                                    <div className="cities-grid">
                                        {(isSearching ? filteredOtherCities : otherCities).map(city => (
                                            <button
                                                key={city}
                                                className="city-button"
                                                onClick={() => handleLocationSelect(city)}
                                            >
                                                <span className="city-name">{city}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isSearching && filteredTopCities.length === 0 && filteredOtherCities.length === 0 && (
                                <p className="no-results">No cities found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Movie Banner */}
            <Banner movies={featuredMovies} />

            {/* Recommended Movies Section */}
            {featuredMovies.length > 0 && (
                <section className="recommended-section">
                    <div className="container">
                        <h2 className="section-title">Recommended Movies</h2>
                        <div className="movies-scroll-container" ref={moviesScrollRef}>
                            <div className="movies-horizontal-scroll">
                                {featuredMovies.map(movie => (
                                    <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                                        <div className="movie-poster-container">
                                            <img src={movie.poster} alt={movie.title} className="movie-poster" />
                                            {movie.rating && (
                                                <div className="movie-rating">
                                                    ⭐ {movie.rating}/10
                                                </div>
                                            )}
                                            {movie.vote_count && (
                                                <div className="movie-votes">
                                                    {movie.vote_count >= 1000
                                                        ? `${(movie.vote_count / 1000).toFixed(1)}K+ Votes`
                                                        : `${movie.vote_count}+ Votes`
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        <div className="movie-info">
                                            <h3 className="movie-title">{movie.title}</h3>
                                            <p className="movie-genre">
                                                {movie.genre || movie.language || 'Action/Drama/Thriller'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}




            {/* Why Choose CineVerse Section - Only show when not logged in */}
            {
                !currentUser && (
                    <section className="why-choose-section">
                        <div className="container">
                            <h2 className="section-title">Why Choose CineVerse?</h2>
                            <p className="section-subtitle">Experience the future of movie booking</p>

                            <div className="features-grid">
                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <div className="feature-icon">🎬</div>
                                    </div>
                                    <h3 className="feature-title">Latest Movies</h3>
                                    <p className="feature-description">
                                        Watch the newest blockbusters and releases as soon as they hit theaters. Never miss out on the latest entertainment.
                                    </p>
                                </div>

                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <div className="feature-icon">⚡</div>
                                    </div>
                                    <h3 className="feature-title">Instant Booking</h3>
                                    <p className="feature-description">
                                        Book your tickets in seconds with our lightning-fast checkout process. No hassle, just pure convenience.
                                    </p>
                                </div>

                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <div className="feature-icon">🎫</div>
                                    </div>
                                    <h3 className="feature-title">Digital Tickets</h3>
                                    <p className="feature-description">
                                        Get instant digital tickets on your phone. No printing required - just show and go at the theater.
                                    </p>
                                </div>

                                <div className="feature-card">
                                    <div className="feature-icon-wrapper">
                                        <div className="feature-icon">🔒</div>
                                    </div>
                                    <h3 className="feature-title">Secure Payments</h3>
                                    <p className="feature-description">
                                        Your transactions are protected with bank-level security. Book with confidence and peace of mind.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <h2 className="section-title">Frequently Asked Questions</h2>

                    <div className="faq-list">
                        {[
                            {
                                question: "What is CineVerse?",
                                answer: "CineVerse is your ultimate movie booking platform that connects you with premium theaters across India. We make booking tickets as enjoyable as watching the movie itself, offering the latest blockbusters, easy seat selection, and instant digital tickets."
                            },
                            {
                                question: "How do I book tickets on CineVerse?",
                                answer: "Booking is simple! Just select your city, browse available movies, choose your preferred theater and showtime, select your seats from our interactive seating layout, and complete your payment. You'll receive instant digital tickets on your phone."
                            },
                            {
                                question: "Can I cancel or modify my booking?",
                                answer: "Yes! You can view and manage all your bookings from the 'My Bookings' section. Cancellation and modification policies may vary by theater. Please check the specific terms before confirming your booking."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept all major payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. All transactions are secured with bank-level encryption to protect your data."
                            },
                            {
                                question: "Do I need to print my tickets?",
                                answer: "No! CineVerse provides instant digital tickets that you can access directly from your phone. Simply show your digital ticket at the theater entrance - no printing required."
                            },
                            {
                                question: "Which cities does CineVerse operate in?",
                                answer: "CineVerse operates in 50+ cities across India, including all major metros and tier-1 cities. We're constantly expanding to bring our services to more locations. Select your city to see available theaters and movies in your area."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button
                                    className={`faq-question ${openFaqIndex === index ? 'active' : ''}`}
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className="faq-icon">{openFaqIndex === index ? '−' : '+'}</span>
                                </button>
                                <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Home;
