import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    if (!booking) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="page">
            <div className="container">
                <div className="confirmation-container fade-in">
                    <div className="success-icon">✅</div>

                    <h1 className="success-title">Booking Successful!</h1>
                    <p className="success-message">
                        Your ticket has been successfully booked.
                    </p>

                    <div className="booking-details">
                        <h2>Booking Details</h2>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">🎬 Movie</span>
                                <span className="detail-value">{booking.movieTitle}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">🎭 Cinema</span>
                                <span className="detail-value">{booking.cinemaName}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">📍 Location</span>
                                <span className="detail-value">{booking.cinemaLocation}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">🏙️ City</span>
                                <span className="detail-value">{booking.city}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">📅 Date</span>
                                <span className="detail-value">
                                    {new Date(booking.showDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">🕐 Time</span>
                                <span className="detail-value">{booking.showTime}</span>
                            </div>

                            {booking.seats && (
                                <>
                                    <div className="detail-item">
                                        <span className="detail-label">🎫 Seats</span>
                                        <span className="detail-value">{booking.seats.join(', ')}</span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">💺 Number of Seats</span>
                                        <span className="detail-value">{booking.numberOfSeats}</span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">💰 Total Price</span>
                                        <span className="detail-value">₹{booking.totalPrice + (booking.numberOfSeats * 20)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/my-bookings')}
                        >
                            View My Bookings
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Book Another Movie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
