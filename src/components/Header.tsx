import React, { useState } from 'react';
import { Film, Search, User, Menu, X, Wallet } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  user: UserType | null;
  onAuthClick: () => void;
  onAccountClick: () => void;
  onShowtimesClick: () => void;
  onPromotionsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  searchQuery, 
  user, 
  onAuthClick, 
  onAccountClick,
  onShowtimesClick,
  onPromotionsClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              CinemaBook
            </h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-red-400 transition-colors"
            >
              Phim Hot
            </button>
            <button 
              onClick={onShowtimesClick}
              className="hover:text-red-400 transition-colors"
            >
              Lịch Chiếu
            </button>
            <button 
              onClick={onPromotionsClick}
              className="hover:text-red-400 transition-colors"
            >
              Khuyến Mãi
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <Wallet className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold">${user.balance.toFixed(2)}</span>
                </div>
                <button
                  onClick={onAccountClick}
                  className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-semibold"
              >
                <User className="h-4 w-4" />
                <span>Đăng nhập</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="block py-2 hover:text-red-400 transition-colors w-full text-left"
            >
              Phim Hot
            </button>
            <button 
              onClick={onShowtimesClick}
              className="block py-2 hover:text-red-400 transition-colors w-full text-left"
            >
              Lịch Chiếu
            </button>
            <button 
              onClick={onPromotionsClick}
              className="block py-2 hover:text-red-400 transition-colors w-full text-left"
            >
              Khuyến Mãi
            </button>
            {user ? (
              <>
                <div className="py-2 text-green-400 font-semibold">
                  Số dư: ${user.balance.toFixed(2)}
                </div>
                <button 
                  onClick={onAccountClick}
                  className="block py-2 hover:text-red-400 transition-colors w-full text-left"
                >
                  Tài khoản ({user.name})
                </button>
              </>
            ) : (
              <button 
                onClick={onAuthClick}
                className="block py-2 hover:text-red-400 transition-colors w-full text-left"
              >
                Đăng nhập
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};