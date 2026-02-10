// LocalStorage Service for managing all data operations
import TMDBService from './tmdbService';

const STORAGE_KEYS = {
  USERS: 'movieBooking_users',
  CURRENT_USER: 'movieBooking_currentUser',
  MOVIES: 'movieBooking_movies',
  CINEMAS: 'movieBooking_cinemas',
  BOOKINGS: 'movieBooking_bookings',
  MOVIES_LAST_FETCH: 'movieBooking_moviesLastFetch'
};

// Sample movie data (fallback)
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    language: 'English',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']
  },
  {
    id: 2,
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    language: 'English',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    cities: ['Mumbai', 'Delhi', 'Bangalore']
  },
  {
    id: 3,
    title: 'Interstellar',
    year: 2014,
    rating: 8.6,
    language: 'English',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    cities: ['Mumbai', 'Bangalore', 'Hyderabad', 'Chennai']
  },
  {
    id: 4,
    title: 'Avengers: Endgame',
    year: 2019,
    rating: 8.4,
    language: 'English',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune']
  },
  {
    id: 5,
    title: 'Dangal',
    year: 2016,
    rating: 8.3,
    language: 'Hindi',
    poster: 'https://images.unsplash.com/photo-1574267432644-f610f5b45b8f?w=400&h=600&fit=crop',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']
  },
  {
    id: 6,
    title: 'RRR',
    year: 2022,
    rating: 8.0,
    language: 'Telugu',
    poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
    cities: ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai']
  }
];

// Sample cinema data
const SAMPLE_CINEMAS = [
  {
    id: 1,
    name: 'PVR Cinemas',
    location: 'Phoenix Mall, Mumbai',
    city: 'Mumbai',
    movieIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 2,
    name: 'INOX Megaplex',
    location: 'Inorbit Mall, Mumbai',
    city: 'Mumbai',
    movieIds: [1, 2, 4, 5]
  },
  {
    id: 3,
    name: 'Cinepolis',
    location: 'Connaught Place, Delhi',
    city: 'Delhi',
    movieIds: [1, 2, 4, 5]
  },
  {
    id: 4,
    name: 'PVR Director\'s Cut',
    location: 'Ambience Mall, Delhi',
    city: 'Delhi',
    movieIds: [1, 2, 4, 5]
  },
  {
    id: 5,
    name: 'INOX',
    location: 'Garuda Mall, Bangalore',
    city: 'Bangalore',
    movieIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 6,
    name: 'PVR',
    location: 'Forum Mall, Bangalore',
    city: 'Bangalore',
    movieIds: [1, 3, 4, 5, 6]
  },
  {
    id: 7,
    name: 'AMB Cinemas',
    location: 'Gachibowli, Hyderabad',
    city: 'Hyderabad',
    movieIds: [1, 3, 4, 5, 6]
  },
  {
    id: 8,
    name: 'PVR',
    location: 'Inorbit Mall, Hyderabad',
    city: 'Hyderabad',
    movieIds: [1, 3, 4, 6]
  },
  {
    id: 9,
    name: 'Sathyam Cinemas',
    location: 'Royapettah, Chennai',
    city: 'Chennai',
    movieIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 10,
    name: 'INOX',
    location: 'Amanora Mall, Pune',
    city: 'Pune',
    movieIds: [1, 2, 4, 5, 6]
  },
  {
    id: 11,
    name: 'PVR',
    location: 'Pavillion Mall, Pune',
    city: 'Pune',
    movieIds: [1, 3, 4, 5]
  },
  {
    id: 12,
    name: 'Cinepolis',
    location: 'Acropolis Mall, Kolkata',
    city: 'Kolkata',
    movieIds: [1, 2, 3, 4, 5, 6]
  },
  {
    id: 13,
    name: 'PVR',
    location: 'Mani Square, Kolkata',
    city: 'Kolkata',
    movieIds: [1, 4, 5, 6]
  },
  {
    id: 14,
    name: 'Cinepolis',
    location: 'Alpha One Mall, Ahmedabad',
    city: 'Ahmedabad',
    movieIds: [1, 2, 4, 5, 6]
  },
  {
    id: 15,
    name: 'PVR',
    location: 'Elante Mall, Chandigarh',
    city: 'Chandigarh',
    movieIds: [1, 2, 3, 4, 5, 6]
  }
];

// Show timings
const SHOW_TIMINGS = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];

class StorageService {
  // Initialize sample data
  static async initializeData() {
    // Initialize users and bookings if not present
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }

    // Initialize cinemas (Always update if count is different to reflect new city additions)
    const existingCinemas = JSON.parse(localStorage.getItem(STORAGE_KEYS.CINEMAS) || '[]');
    if (existingCinemas.length !== SAMPLE_CINEMAS.length) {
      const storedMovies = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
      let cinemasToStore = [...SAMPLE_CINEMAS];

      // If we have TMDB movies (detected by non-sequential IDs), map them to all cinemas
      if (storedMovies.length > 0) {
        const movieIds = storedMovies.map(m => m.id);
        cinemasToStore = cinemasToStore.map(c => ({
          ...c,
          movieIds: movieIds // For prototype, let all cinemas show all movies
        }));
      }

      localStorage.setItem(STORAGE_KEYS.CINEMAS, JSON.stringify(cinemasToStore));

    }

    // Check if we need to fetch movies from TMDB
    // Fetch from TMDB if: 
    // 1. No movies exist
    // 2. Last fetch was more than 24 hours ago
    // 3. We have sample data (id < 100) but the API is now configured
    const isSampleData = existingMovies && JSON.parse(existingMovies).some(m => m.id < 100);
    if (!existingMovies || !lastFetch || parseInt(lastFetch) < oneDayAgo || (isSampleData && TMDBService.isConfigured())) {
      if (TMDBService.isConfigured()) {
        try {

          // Fetch mixed collection: now playing + top rated + Indian movies
          const tmdbMovies = await TMDBService.getMixedMovies();

          if (tmdbMovies && tmdbMovies.length > 0) {
            // Update cinema movieIds to match TMDB movie IDs
            const movieIds = tmdbMovies.map(m => m.id);
            const updatedCinemas = SAMPLE_CINEMAS.map(cinema => ({
              ...cinema,
              movieIds: movieIds
            }));

            localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(tmdbMovies));
            localStorage.setItem(STORAGE_KEYS.CINEMAS, JSON.stringify(updatedCinemas));
            localStorage.setItem(STORAGE_KEYS.MOVIES_LAST_FETCH, Date.now().toString());

            return;
          }
        } catch (error) {

        }
      }
    } else {
      // Movies already exist in storage, just ensure cinemas are mapped to them 
      // (This fix is for users who already had movies but just got new cinemas)
      const storedMovies = JSON.parse(existingMovies);
      const movieIds = storedMovies.map(m => m.id);
      const cinemas = JSON.parse(localStorage.getItem(STORAGE_KEYS.CINEMAS) || '[]');

      // Update cinemas movieIds if they don't seem to match TMDB IDs
      if (cinemas.length > 0 && cinemas[0].movieIds.some(id => id < 100)) {
        const updatedCinemas = cinemas.map(c => ({
          ...c,
          movieIds: movieIds
        }));
        localStorage.setItem(STORAGE_KEYS.CINEMAS, JSON.stringify(updatedCinemas));

      }
    }

    // Fallback to sample data if TMDB fetch failed or not needed
    if (!existingMovies) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(SAMPLE_MOVIES));

    }
  }

  // User operations
  static getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  static addUser(user) {
    const users = this.getUsers();
    users.push({ ...user, id: Date.now() });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static findUser(email, password) {
    const users = this.getUsers();
    return users.find(u => u.email === email && u.password === password);
  }

  static userExists(email) {
    const users = this.getUsers();
    return users.some(u => u.email === email);
  }

  static setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Movie operations
  static getMovies() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MOVIES) || '[]');
  }

  static getMovieById(id) {
    const movies = this.getMovies();
    // Handle both numeric IDs and IMDB string IDs
    return movies.find(m => m.id === id || m.id === parseInt(id) || m.imdbId === id);
  }

  static getCitiesFromMovies() {
    const movies = this.getMovies();
    const citiesSet = new Set();
    movies.forEach(movie => {
      movie.cities.forEach(city => citiesSet.add(city));
    });
    return Array.from(citiesSet).sort();
  }

  // Cinema operations
  static getCinemas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CINEMAS) || '[]');
  }

  static getCinemaById(id) {
    const cinemas = this.getCinemas();
    return cinemas.find(c => c.id === parseInt(id));
  }

  static getCinemasForMovie(movieId, city) {
    const cinemas = this.getCinemas();
    return cinemas.filter(c =>
      (c.movieIds.includes(movieId) || c.movieIds.includes(parseInt(movieId))) &&
      (!city || c.city === city)
    );
  }

  // Show timings
  static getShowTimings() {
    return SHOW_TIMINGS;
  }

  // Booking operations
  static getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  }

  static addBooking(booking) {
    const bookings = this.getBookings();
    const newBooking = {
      ...booking,
      id: Date.now(),
      bookingDate: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  }

  static getUserBookings(userId) {
    const bookings = this.getBookings();
    return bookings.filter(b => b.userId === userId);
  }
}

export default StorageService;
