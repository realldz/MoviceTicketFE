import React from 'react';
import { Clock, Star, Calendar } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(movie)}
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <div className="bg-yellow-500 text-black px-2 py-1 rounded-lg flex items-center space-x-1 text-sm font-bold">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.rating}</span>
          </div>
        </div>
        {movie.isPopular && (
          <div className="absolute top-3 left-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
              HOT
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 text-white">
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{movie.title}</h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{movie.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{movie.duration} phút</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {movie.genre.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};