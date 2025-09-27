import React, { useState } from 'react';
import {
  X, Clock, Star, Calendar, Users, Play,
  MapPin, DollarSign, Ticket
} from 'lucide-react';
import { Showtime, Theater } from '../types/api';
import { MovieResponseDto } from '../types/api';

interface MovieDetailProps {
  movie: MovieResponseDto;
  showtimes: Showtime[];
  theaters: Theater[];
  onClose: () => void;
  onBookTicket: (movie: MovieResponseDto, showtime: Showtime, theater: Theater) => void;
}

const getYear = (date: string | undefined) => {
  if (!date) return '';
  return new Date(date).getFullYear();
}

const dates = Array.from({ length: 3 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const value = date.toISOString().slice(0, 10);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  let label = '';
  if (i === 0) label = `Hôm nay - ${day}/${month}`;
  else if (i === 1) label = `Ngày mai - ${day}/${month}`;
  else label = `Ngày kia - ${day}/${month}`;
  return { value, label };
});

const getTheaters = (showtimes: Showtime[], theaters: Theater[]) => {
  const theaterIds = showtimes.map(st => st.theaterId);
  return theaters.filter(th => theaterIds.includes(th.id));
}
export const MovieDetail: React.FC<MovieDetailProps> = ({
  movie,
  showtimes,
  theaters,
  onClose,
  onBookTicket
}) => {
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const filteredTheaters = getTheaters(showtimes, theaters);
  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate);

  const handleWatchTrailer = () => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-96 object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-8 text-white -mt-32 relative z-20">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto lg:mx-0"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{movie.rating}/10</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.duration} phút</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{getYear(movie.releaseDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre?.split(',').map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {movie.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Đạo diễn
                    </h3>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Diễn viên
                    </h3>
                    <p className="text-gray-300">{movie.cast}</p>
                  </div>
                </div>

                {movie.trailerUrl && (
                  <button
                    onClick={handleWatchTrailer}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors mb-8">
                    <Play className="h-5 w-5" />
                    <span>Xem Trailer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Showtimes */}
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold mb-6">Lịch Chiếu</h2>

              <div className="mb-6">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {dates.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>

              {filteredShowtimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredShowtimes.map((showtime) => (
                    <div
                      key={showtime.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-red-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-red-400">
                          {showtime.startTime}
                        </span>
                        <div className="flex items-center space-x-1 text-green-400">
                          <Ticket className="h-4 w-4" />
                          <span className="text-sm">{showtime.availableSeats} ghế trống</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{getTheaters(filteredShowtimes, theaters).find(th => th.id === showtime.theaterId)?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{showtime.ticketPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const theater = filteredTheaters.find(th => th.id === showtime.theaterId);
                          if (theater) {
                            onBookTicket(movie, showtime, theater);
                          } else {
                            alert('Không tìm thấy rạp chiếu cho suất này.');
                          }
                        }}
                        disabled={showtime.availableSeats === 0}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors"
                      >
                        {showtime.availableSeats === 0 ? 'Hết vé' : 'Đặt vé'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Không có suất chiếu nào cho ngày này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};