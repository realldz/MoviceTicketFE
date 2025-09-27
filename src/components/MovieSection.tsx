import React from 'react';
import { MovieCard } from './MovieCard';
import { MovieResponseDto } from '../types/api';

interface MovieSectionProps {
  title: string;
  movies: MovieResponseDto[];
  onMovieClick: (movie: MovieResponseDto) => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  onMovieClick
}) => {
  if (movies.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-500 pl-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
};