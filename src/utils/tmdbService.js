// TMDB API Service
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBService {
    /**
     * Fetch popular movies
     */
    static async getPopularMovies(page = 1) {
        try {
            const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`;


            const response = await fetch(url);
            const data = await response.json();



            if (!response.ok) {
                throw new Error(`TMDB API Error: ${data.status_message || response.statusText}`);
            }

            if (!data.results || data.results.length === 0) {
                throw new Error('No popular movies found from TMDB');
            }


            return data.results.map(movie => this.mapTMDBToMovie(movie));
        } catch (error) {
            console.error('Error fetching popular movies from TMDB:', error);
            return [];
        }
    }

    /**
     * Fetch now playing movies
     */
    static async getNowPlayingMovies(page = 1) {
        try {
            const url = `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`;


            const response = await fetch(url);
            const data = await response.json();

            // Log the response for debugging


            if (!response.ok) {
                throw new Error(`TMDB API Error: ${data.status_message || response.statusText}`);
            }

            if (!data.results || data.results.length === 0) {
                console.warn('No now playing movies found, trying popular movies instead');
                return this.getPopularMovies(page);
            }

            return data.results.map(movie => this.mapTMDBToMovie(movie));
        } catch (error) {
            console.error('Error fetching now playing movies from TMDB:', error);

            // Fallback to popular movies if now playing fails
            return this.getPopularMovies(page);
        }
    }

    /**
     * Fetch movie details by ID
     */
    static async getMovieById(movieId) {
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
            );
            const data = await response.json();

            if (data.success === false) {
                throw new Error(data.status_message || 'Movie not found');
            }

            return this.mapTMDBToMovie(data);
        } catch (error) {
            console.error(`Error fetching movie ${movieId} from TMDB:`, error);
            return null;
        }
    }

    /**
     * Search movies by title
     */
    static async searchMovies(query, page = 1) {
        try {
            const response = await fetch(
                `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
            );
            const data = await response.json();

            if (!data.results) {
                return [];
            }

            return data.results.map(movie => this.mapTMDBToMovie(movie));
        } catch (error) {
            console.error('Error searching movies from TMDB:', error);
            return [];
        }
    }

    /**
     * Fetch top-rated movies
     */
    static async getTopRatedMovies(page = 1) {
        try {
            const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`;


            const response = await fetch(url);
            const data = await response.json();



            if (!response.ok) {
                throw new Error(`TMDB API Error: ${data.status_message || response.statusText}`);
            }

            if (!data.results || data.results.length === 0) {
                throw new Error('No top-rated movies found from TMDB');
            }


            return data.results.map(movie => this.mapTMDBToMovie(movie));
        } catch (error) {
            console.error('Error fetching top-rated movies from TMDB:', error);
            return [];
        }
    }

    /**
     * Fetch Indian/Bollywood movies (Hindi language)
     */
    static async getIndianMovies(page = 1) {
        try {
            const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&with_original_language=hi&sort_by=popularity.desc&vote_count.gte=10`;


            const response = await fetch(url);
            const data = await response.json();



            if (!response.ok) {
                throw new Error(`TMDB API Error: ${data.status_message || response.statusText}`);
            }

            if (!data.results || data.results.length === 0) {
                console.warn('No Indian movies found');
                return [];
            }


            return data.results.map(movie => this.mapTMDBToMovie(movie));
        } catch (error) {
            console.error('Error fetching Indian movies from TMDB:', error);
            return [];
        }
    }

    /**
     * Fetch mixed collection: Now Playing + Top Rated + Indian Movies
     */
    static async getMixedMovies() {
        try {


            // Fetch from multiple sources
            const [nowPlaying, topRated, indianMovies] = await Promise.all([
                this.getNowPlayingMovies(1),
                this.getTopRatedMovies(1),
                this.getIndianMovies(1)
            ]);

            // Combine and shuffle
            const allMovies = [
                ...nowPlaying.slice(0, 6),
                ...topRated.slice(0, 4),
                ...indianMovies.slice(0, 6)
            ];

            // Remove duplicates based on ID
            const uniqueMovies = Array.from(
                new Map(allMovies.map(movie => [movie.id, movie])).values()
            );


            return uniqueMovies;
        } catch (error) {
            console.error('Error fetching mixed movies:', error);
            return [];
        }
    }

    /**
     * Get poster URL
     */
    static getPosterUrl(posterPath, size = 'w500') {
        if (!posterPath) {
            return 'https://via.placeholder.com/500x750?text=No+Poster';
        }
        return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
    }

    /**
     * Get backdrop URL
     */
    static getBackdropUrl(backdropPath, size = 'w1280') {
        if (!backdropPath) {
            return 'https://via.placeholder.com/1280x720?text=No+Backdrop';
        }
        return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
    }

    /**
     * Map TMDB response to our movie data structure
     */
    static mapTMDBToMovie(tmdbData) {
        // Parse rating - TMDB returns vote_average (0-10)
        let rating = 0;
        if (tmdbData.vote_average) {
            rating = parseFloat(tmdbData.vote_average.toFixed(1));
        }

        // Parse year from release_date
        let year = 0;
        if (tmdbData.release_date) {
            year = parseInt(tmdbData.release_date.split('-')[0]);
        }

        // Get primary language
        let language = 'English';
        if (tmdbData.original_language) {
            const languageMap = {
                'en': 'English',
                'hi': 'Hindi',
                'te': 'Telugu',
                'ta': 'Tamil',
                'ml': 'Malayalam',
                'kn': 'Kannada',
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese'
            };
            language = languageMap[tmdbData.original_language] || 'English';
        }

        // Generate cities (random selection for demo purposes)
        const allCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
        const numCities = Math.floor(Math.random() * 4) + 3; // 3-6 cities
        const cities = allCities.sort(() => 0.5 - Math.random()).slice(0, numCities);

        return {
            id: tmdbData.id,
            title: tmdbData.title || tmdbData.original_title,
            year: year,
            rating: rating,
            language: language,
            poster: this.getPosterUrl(tmdbData.poster_path),
            backdrop: this.getBackdropUrl(tmdbData.backdrop_path),
            cities: cities,
            // Additional fields from TMDB
            plot: tmdbData.overview,
            genre: tmdbData.genres ? tmdbData.genres.map(g => g.name).join(', ') : '',
            popularity: tmdbData.popularity,
            voteCount: tmdbData.vote_count,
            tmdbId: tmdbData.id,
        };
    }

    /**
     * Check if API key is configured
     */
    static isConfigured() {
        return !!TMDB_API_KEY && TMDB_API_KEY !== 'your_api_key_here';
    }
}

export default TMDBService;
