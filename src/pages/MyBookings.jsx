import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StorageService from '../utils/StorageService';
import { useAuth } from '../context/AuthContext';
import './MyBookings.css';

const MyBookings = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const userBookings = StorageService.getUserBookings(currentUser.id);
        // Sort by booking date (newest first)
        const sortedBookings = userBookings.sort((a, b) =>
            new Date(b.bookingDate) - new Date(a.bookingDate)
        );
        setBookings(sortedBookings);
    }, [currentUser]);

    const isUpcoming = (showDate) => {
        return new Date(showDate) >= new Date();
    };

    if (bookings.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="no-bookings fade-in">
                        <h1>📋 My Bookings</h1>
                        <div className="empty-state">
                            <div className="empty-icon">🎬</div>
                            <h2>No bookings yet</h2>
                            <p className="text-secondary">Start booking your favorite movies now!</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/dashboard')}
                            >
                                Browse Movies
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="bookings-header fade-in">
                    <h1>📋 My Bookings</h1>
                    <p className="text-secondary">View all your movie bookings</p>
                </div>

                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card fade-in">
                            <div className="booking-status">
                                {isUpcoming(booking.showDate) ? (
                                    <span className="status-badge upcoming">Upcoming</span>
                                ) : (
                                    <span className="status-badge past">Past</span>
                                )}
                            </div>

                            <div className="booking-content">
                                <div className="booking-header-info">
                                    <h3>{booking.movieTitle}</h3>
                                    <p className="booking-cinema">🎭 {booking.cinemaName}</p>
                                </div>

                                <div className="booking-details-grid">
                                    <div className="booking-detail">
                                        <span className="detail-icon">📍</span>
                                        <span>{booking.cinemaLocation}</span>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">🏙️</span>
                                        <span>{booking.city}</span>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">📅</span>
                                        <span>
                                            {new Date(booking.showDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="booking-detail">
                                        <span className="detail-icon">🕐</span>
                                        <span>{booking.showTime}</span>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <span className="booking-date-info">
                                        Booked on {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
