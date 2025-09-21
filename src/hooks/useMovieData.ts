import { useState, useEffect } from 'react';
import { Movie, Showtime, Booking, User, Promotion } from '../types';
import { movies as movieData, showtimes as showtimeData } from '../data/movies';
import { promotions as promotionData } from '../data/promotions';

export const useMovieData = () => {
  const [movies, setMovies] = useState<Movie[]>(movieData);
  const [showtimes, setShowtimes] = useState<Showtime[]>(showtimeData);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>(promotionData);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('movieBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Simple authentication simulation
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      balance: 100.0, // Starting balance
      bookingHistory: []
    };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const register = (name: string, email: string, password: string) => {
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      balance: 50.0, // Welcome bonus
      bookingHistory: []
    };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const topUpBalance = (amount: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, balance: currentUser.balance + amount };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deductBalance = (amount: number) => {
    if (currentUser && currentUser.balance >= amount) {
      const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('movieBookings', JSON.stringify(newBookings));
    
    // Update showtime availability
    setShowtimes(prev => prev.map(showtime => 
      showtime.id === booking.showtimeId
        ? { ...showtime, availableSeats: showtime.availableSeats - booking.seats.length }
        : showtime
    ));
  };

  const getPopularMovies = () => {
    return movies.filter(movie => movie.isPopular);
  };

  const getRecommendedMovies = () => {
    if (!currentUser || bookings.length === 0) {
      return movies.slice(0, 4); // Return first 4 movies if no history
    }

    // Simple recommendation based on genres of previously booked movies
    const bookedMovies = bookings.map(booking => 
      movies.find(movie => movie.id === booking.movieId)
    ).filter(Boolean) as Movie[];

    const likedGenres = bookedMovies.flatMap(movie => movie.genre);
    const genreCount = likedGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return movies
      .filter(movie => !bookedMovies.some(booked => booked.id === movie.id))
      .filter(movie => movie.genre.some(genre => topGenres.includes(genre)))
      .slice(0, 6);
  };

  const getMovieShowtimes = (movieId: string) => {
    return showtimes.filter(showtime => showtime.movieId === movieId);
  };

  const searchMovies = (query: string, genre?: string) => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(query.toLowerCase()) ||
                           movie.description.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = !genre || movie.genre.includes(genre);
      return matchesSearch && matchesGenre;
    });
  };

  return {
    movies,
    showtimes,
    bookings,
    currentUser,
    promotions,
    addBooking,
    login,
    register,
    logout,
    topUpBalance,
    deductBalance,
    getPopularMovies,
    getRecommendedMovies,
    getMovieShowtimes,
    searchMovies
  };
};