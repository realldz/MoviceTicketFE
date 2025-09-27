import React from 'react';
import { Play, Star, Clock } from 'lucide-react';
import { MovieResponseDto } from '../types/api';

interface HeroSectionProps {
  featuredMovie: MovieResponseDto;
  onWatchTrailer: () => void;
  onBookNow: (movie: MovieResponseDto) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredMovie,
  onWatchTrailer,
  onBookNow
}) => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src={featuredMovie.posterUrl}
          alt={featuredMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 leading-tight">
              {featuredMovie.title}
            </h1>

            <div className="flex items-center space-x-6 mb-6 text-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">{featuredMovie.rating}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{featuredMovie.duration} phút</span>
              </div>
              <span className="text-yellow-400 font-semibold">
                {(featuredMovie.releaseDate)}
              </span>
            </div>

            {/* <div className="flex flex-wrap gap-2 mb-6">
              {featuredMovie.genre.map((genre, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm border border-white/30"
                >
                  {genre}
                </span>
              ))}
            </div> */}

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {featuredMovie.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onBookNow(featuredMovie)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
              >
                <span>ĐẶT VÉ NGAY</span>
              </button>
              <button
                onClick={onWatchTrailer}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="h-5 w-5" />
                <span>XEM TRAILER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};