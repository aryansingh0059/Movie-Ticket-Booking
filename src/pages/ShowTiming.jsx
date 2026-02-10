import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StorageService from '../utils/StorageService';
import { useAuth } from '../context/AuthContext';
import './ShowTiming.css';

const ShowTiming = () => {
    const { movieId, cinemaId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [movie, setMovie] = useState(null);
    const [cinema, setCinema] = useState(null);
    const [showTimings, setShowTimings] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        const movieData = StorageService.getMovieById(movieId);
        const cinemaData = StorageService.getCinemaById(cinemaId);
        const timings = StorageService.getShowTimings();

        setMovie(movieData);
        setCinema(cinemaData);
        setShowTimings(timings);

        // Set current date as default (local time)
        const today = new Date().toLocaleDateString('en-CA');
        setSelectedDate(today);
    }, [movieId, cinemaId]);

    const handleProceedToSeats = () => {
        if (!selectedTime) {
            alert('Please select a show time');
            return;
        }

        // Check if user is logged in
        if (!currentUser) {
            // Store the booking intent in localStorage to resume after login
            localStorage.setItem('bookingIntent', JSON.stringify({
                movieId,
                cinemaId,
                showDate: selectedDate,
                showTime: selectedTime,
                returnPath: `/movie/${movieId}/cinema/${cinemaId}/seats`
            }));
            navigate('/login');
            return;
        }

        navigate(`/movie/${movieId}/cinema/${cinemaId}/seats`, {
            state: {
                showDate: selectedDate,
                showTime: selectedTime
            }
        });
    };

    if (!movie || !cinema) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="page">
            <div className="container">
                <div className="showtime-header fade-in">
                    <button onClick={() => navigate(`/movie/${movieId}/cinemas`)} className="btn-back">
                        ← Back to Cinemas
                    </button>

                    <div className="booking-summary">
                        <div className="summary-item">
                            <span className="summary-label">Movie</span>
                            <span className="summary-value">{movie.title}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Cinema</span>
                            <span className="summary-value">{cinema.name}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Location</span>
                            <span className="summary-value">{cinema.location}</span>
                        </div>
                    </div>
                </div>

                <div className="showtime-selection fade-in">
                    <h2>Select Show Date & Time</h2>

                    <div className="date-selection">
                        <label className="selection-label">📅 Select Date</label>
                        <input
                            type="date"
                            className="date-input"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toLocaleDateString('en-CA')}
                        />
                    </div>

                    <div className="time-selection">
                        <label className="selection-label">🕐 Select Show Time</label>
                        <div className="time-slots">
                            {showTimings.map(time => (
                                <button
                                    key={time}
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-full btn-book-ticket"
                        onClick={handleProceedToSeats}
                        disabled={!selectedTime}
                    >
                        Proceed to Select Seats →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowTiming;
