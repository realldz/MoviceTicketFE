import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { Movie, Showtime } from '../types';

interface ShowtimesModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  showtimes: Showtime[];
  onBookTicket: (movie: Movie, showtime: Showtime) => void;
}

export const ShowtimesModal: React.FC<ShowtimesModalProps> = ({
  isOpen,
  onClose,
  movies,
  showtimes,
  onBookTicket
}) => {
  const [selectedDate, setSelectedDate] = useState('2025-01-15');

  if (!isOpen) return null;

  const dates = [
    { value: '2025-01-15', label: 'Hôm nay - 15/01' },
    { value: '2025-01-16', label: 'Ngày mai - 16/01' },
    { value: '2025-01-17', label: 'Ngày kia - 17/01' }
  ];

  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate);
  const moviesWithShowtimes = movies.filter(movie => 
    filteredShowtimes.some(st => st.movieId === movie.id)
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gray-800 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-red-500" />
              <h2 className="text-2xl font-bold text-white">Lịch chiếu phim</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Date Selection */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {dates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedDate === date.value
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Movies and Showtimes */}
            <div className="space-y-8">
              {moviesWithShowtimes.map((movie) => {
                const movieShowtimes = filteredShowtimes.filter(st => st.movieId === movie.id);
                
                return (
                  <div key={movie.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Movie Info */}
                      <div className="flex gap-4">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {movie.genre.slice(0, 3).map((genre, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{movie.duration} phút</span>
                            </div>
                            <span>⭐ {movie.rating}/10</span>
                          </div>
                        </div>
                      </div>

                      {/* Showtimes */}
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-3">Suất chiếu:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {movieShowtimes.map((showtime) => (
                            <div
                              key={showtime.id}
                              className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:border-red-500 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-red-400">
                                  {showtime.time}
                                </span>
                                <span className="text-green-400 text-sm">
                                  {showtime.availableSeats} ghế trống
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{showtime.theater}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>${showtime.price}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => onBookTicket(movie, showtime)}
                                disabled={showtime.availableSeats === 0}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded text-sm font-semibold transition-colors"
                              >
                                {showtime.availableSeats === 0 ? 'Hết vé' : 'Đặt vé'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {moviesWithShowtimes.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Không có suất chiếu nào cho ngày này</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};