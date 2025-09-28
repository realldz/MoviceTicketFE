import { useState, useEffect, useCallback } from 'react';
import { Showtime, Booking, User, Promotion, Theater } from '../types/api';
import { promotions as promotionData } from '../data/promotions';
import { authApi, movieApi, showtimeApi } from '../api';
import { MovieResponseDto } from '../types/api';
import userApi from '../api/userApi';
import theaterApi from '../api/theaterApi';

export const useMovieData = () => {
  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
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
    async function getMovie() {
      setMovies(await movieApi.getAll());
    }
    getMovie();
  }, []);

  useEffect(() => {
    console.log(bookings);
  }, [bookings]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      await getMe();
      return { error: null };
    } catch (error: any) {
      // Safely access the error message and provide fallbacks
      const errorMessage =
        error?.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      return { error: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ error: string | Array<string> | null }> => {
    try {
      await authApi.register({
        name,
        email,
        password
      });
      return { error: null };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = err.response as { status: number; data?: { errors?: any } };
      if (response && response.status === 400 && response.data && response.data.errors) {
        const errors = response.data.errors;
        return { error: Object.values(errors).flat() as Array<string> };
      } else if (response && response.status === 409) {
        return { error: 'Email đã được sử dụng.' };
      } else {
        return { error: 'Đã xảy ra lỗi không xác định.' };
      }
    }
    // setCurrentUser(user);
    // localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const getMe = async (): Promise<User> => {
    const response = await userApi.getMe();
    setCurrentUser(response);
    localStorage.setItem('currentUser', JSON.stringify(response));
    return response;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
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
    console.log('Booking added:', booking);
    setBookings(prevBookings => {
      const newBookings = [...prevBookings, booking];
      localStorage.setItem('movieBookings', JSON.stringify(newBookings));
      return newBookings;
    });

    // Update showtime availability
    setShowtimes(prev => prev.map(showtime =>
      showtime.id === booking.showtimeId
        ? { ...showtime, availableSeats: showtime.availableSeats - booking.seatNumbers.length }
        : showtime
    ));
  };

  // const getPopularMovies = () => {
  //   return movies.filter(movie => movie.isPopular);
  // };

  const getRecommendedMovies = () => {
    if (!currentUser || bookings.length === 0) {
      return movies.slice(0, 4); // Return first 4 movies if no history
    }

    // Simple recommendation based on genres of previously booked movies
    const bookedMovies = bookings.map(booking =>
      movies.find(movie => movie.id === booking.movieId)
    ).filter(Boolean) as MovieResponseDto[];

    const likedGenres = bookedMovies.flatMap(movie => movie.genre || []);
    const genreCount = likedGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return movies
      .filter(movie => !bookedMovies.some(booked => booked.id === movie.id))
      .filter(movie => movie.genre && topGenres.some(genre => movie.genre?.includes(genre)))
      .slice(0, 6);
  };

  const getMovieShowtimes = useCallback(async (movieId: string | null): Promise<Showtime[]> => {
    const response = await showtimeApi.getByMovieId(movieId || '');
    response.forEach(showtime => {
      showtime.date = showtime.date.slice(0, 10); // Chuyển thành 'YYYY-MM-DD'
      showtime.startTime = showtime.startTime.slice(11, 16); // Chuyển thành 'HH:MM'
    });
    return response;
  }, []);

  const searchMovies = (query: string, genre?: string) => {
    return movies.filter(movie => {
      const matchesSearch = movie.title?.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = !genre || movie.genre?.includes(genre);
      return matchesSearch && matchesGenre;
    });
  };

  const getTheaters = async (): Promise<Theater[]> => {
    const response = await theaterApi.getAll();
    return response;
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
    // getPopularMovies,
    getRecommendedMovies,
    getMovieShowtimes,
    searchMovies,
    getTheaters
  };
};