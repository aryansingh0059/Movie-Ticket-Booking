import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { FaStar, FaCalendarAlt, FaTicketAlt, FaPlay } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import './Banner.css';

const Banner = ({ movies }) => {
    const navigate = useNavigate();

    if (!movies || movies.length === 0) return null;

    const handleBookNow = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="movie-banner-container">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                effect={'fade'}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className="movie-swiper"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="banner-slide">
                            {/* Background Backdrop (Blurred) */}
                            <div
                                className="banner-backdrop"
                                style={{ backgroundImage: `url(${movie.poster})` }}
                            ></div>

                            {/* Overlay Gradient */}
                            <div className="banner-overlay"></div>

                            {/* Content */}
                            <div className="banner-content container">
                                <div className="banner-poster-wrapper">
                                    <img src={movie.poster} alt={movie.title} className="banner-poster" />
                                </div>

                                <div className="banner-info">
                                    <h1 className="banner-title">{movie.title}</h1>

                                    <div className="banner-meta">
                                        <span className="meta-item rating">
                                            <FaStar className="icon star" /> {movie.rating}/10
                                        </span>
                                        <span className="meta-item">
                                            <FaCalendarAlt className="icon" /> {movie.year}
                                        </span>
                                        <span className="meta-item language">
                                            {movie.language}
                                        </span>
                                    </div>

                                    <p className="banner-tagline">
                                        Experience the magic of {movie.title} in theaters near you.
                                    </p>

                                    <div className="banner-actions">
                                        <button
                                            className="btn btn-primary btn-large banner-btn"
                                            onClick={() => handleBookNow(movie.id)}
                                        >
                                            <FaTicketAlt /> Book Tickets
                                        </button>
                                        {/* Placeholder for trailer button if we had trailer links */}
                                        <button className="btn btn-secondary btn-large banner-btn">
                                            <FaPlay /> Watch Trailer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;
