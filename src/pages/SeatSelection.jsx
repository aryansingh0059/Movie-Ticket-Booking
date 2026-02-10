import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import StorageService from '../utils/StorageService';
import { useAuth } from '../context/AuthContext';
import './SeatSelection.css';

const SeatSelection = () => {
    const { movieId, cinemaId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const { showDate, showTime } = location.state || {};

    const [movie, setMovie] = useState(null);
    const [cinema, setCinema] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (!showDate || !showTime) {
            navigate(`/movie/${movieId}/cinema/${cinemaId}/showtimes`);
            return;
        }

        const movieData = StorageService.getMovieById(movieId);
        const cinemaData = StorageService.getCinemaById(cinemaId);

        setMovie(movieData);
        setCinema(cinemaData);

        // Generate seat layout
        const seatLayout = generateSeatLayout();
        setSeats(seatLayout);
    }, [movieId, cinemaId, showDate, showTime, navigate]);

    const generateSeatLayout = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerRow = 12;
        const layout = [];

        rows.forEach((row, rowIndex) => {
            for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
                const seatId = `${row}${seatNum}`;

                // Determine seat type and price
                let type = 'regular';
                let price = 200;

                if (rowIndex <= 2) {
                    type = 'premium';
                    price = 350;
                } else if (rowIndex >= 7) {
                    type = 'economy';
                    price = 150;
                }

                // Randomly mark some seats as booked (for demo)
                const isBooked = Math.random() < 0.3;

                layout.push({
                    id: seatId,
                    row,
                    number: seatNum,
                    type,
                    price,
                    status: isBooked ? 'booked' : 'available'
                });
            }
        });

        return layout;
    };

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked') return;

        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            if (selectedSeats.length >= 10) {
                alert('You can select maximum 10 seats at a time');
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const getTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        const booking = {
            userId: currentUser.id,
            userName: currentUser.name,
            movieId: movie.id,
            movieTitle: movie.title,
            cinemaId: cinema.id,
            cinemaName: cinema.name,
            cinemaLocation: cinema.location,
            city: cinema.city,
            showDate,
            showTime,
            seats: selectedSeats.map(s => s.id),
            seatDetails: selectedSeats,
            totalPrice: getTotalPrice(),
            numberOfSeats: selectedSeats.length
        };

        StorageService.addBooking(booking);
        navigate('/booking-confirmation', { state: { booking } });
    };

    if (!movie || !cinema) {
        return <div className="loading">Loading...</div>;
    }

    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    return (
        <div className="page">
            <div className="container">
                <div className="seat-header fade-in">
                    <button
                        onClick={() => navigate(`/movie/${movieId}/cinema/${cinemaId}/showtimes`)}
                        className="btn-back"
                    >
                        ← Back to Show Timings
                    </button>

                    <div className="booking-info">
                        <h1>Select Your Seats</h1>
                        <div className="booking-meta">
                            <span>🎬 {movie.title}</span>
                            <span>🎭 {cinema.name}</span>
                            <span>📅 {new Date(showDate).toLocaleDateString()}</span>
                            <span>🕐 {showTime}</span>
                        </div>
                    </div>
                </div>

                <div className="seat-selection-container fade-in">
                    <div className="theater-section">
                        <div className="seat-legend">
                            {/* ... legend items ... */}
                            <div className="legend-item">
                                <div className="seat-demo available"></div>
                                <span>Available</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-demo selected"></div>
                                <span>Selected</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-demo booked"></div>
                                <span>Booked</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-demo premium"></div>
                                <span>Premium (₹350)</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-demo regular"></div>
                                <span>Regular (₹200)</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-demo economy"></div>
                                <span>Economy (₹150)</span>
                            </div>
                        </div>

                        <div className="seat-grid">
                            {Object.keys(groupedSeats).map(row => (
                                <div key={row} className="seat-row">
                                    <div className="row-label">{row}</div>
                                    <div className="seats">
                                        {groupedSeats[row].map(seat => {
                                            const isSelected = selectedSeats.find(s => s.id === seat.id);
                                            return (
                                                <div
                                                    key={seat.id}
                                                    className={`seat ${seat.type} ${seat.status} ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleSeatClick(seat)}
                                                    title={`${seat.id} - ₹${seat.price}`}
                                                >
                                                    {seat.number}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="row-label">{row}</div>
                                </div>
                            ))}
                        </div>

                        <div className="screen">
                            <div className="screen-label">SCREEN</div>
                        </div>
                    </div>

                    <div className="booking-summary-panel">
                        <h2>Booking Summary</h2>

                        {selectedSeats.length > 0 ? (
                            <>
                                <div className="selected-seats-list">
                                    <h3>Selected Seats ({selectedSeats.length})</h3>
                                    <div className="seats-chips">
                                        {selectedSeats.map(seat => (
                                            <div key={seat.id} className="seat-chip">
                                                <span>{seat.id}</span>
                                                <span className="seat-price">₹{seat.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>Subtotal ({selectedSeats.length} seats)</span>
                                        <span>₹{getTotalPrice()}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Convenience Fee</span>
                                        <span>₹{selectedSeats.length * 20}</span>
                                    </div>
                                    <div className="price-row total">
                                        <span>Total Amount</span>
                                        <span>₹{getTotalPrice() + (selectedSeats.length * 20)}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-full"
                                    onClick={handleProceedToPayment}
                                >
                                    Proceed to Book
                                </button>
                            </>
                        ) : (
                            <div className="empty-selection">
                                <p>👆 Select seats to continue</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
