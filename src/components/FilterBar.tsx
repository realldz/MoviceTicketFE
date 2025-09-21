import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  selectedGenre, 
  onGenreChange 
}) => {
  const genres = [
    'Tất cả',
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller'
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-white">
          <Filter className="h-5 w-5" />
          <span className="font-semibold">Lọc theo thể loại:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre === 'Tất cả' ? '' : genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (genre === 'Tất cả' && !selectedGenre) || selectedGenre === genre
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};