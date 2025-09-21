import { useState } from 'react';
import { Movie, Showtime, Booking } from './types';
import { useMovieData } from './hooks/useMovieData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MovieSection } from './components/MovieSection';
import { FilterBar } from './components/FilterBar';
import { MovieDetail } from './components/MovieDetail';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { PaymentModal } from './components/PaymentModal';
import { PromotionsModal } from './components/PromotionsModal';
import { ShowtimesModal } from './components/ShowtimesModal';

function App() {
  const {
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
  } = useMovieData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [bookingData, setBookingData] = useState<{
    movie: Movie;
    showtime: Showtime;
  } | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showShowtimesModal, setShowShowtimesModal] = useState(false);

  const popularMovies = getPopularMovies();
  const recommendedMovies = getRecommendedMovies();
  const featuredMovie = popularMovies[0] || movies[0];

  const filteredMovies = searchQuery || selectedGenre
    ? searchMovies(searchQuery, selectedGenre)
    : movies;

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleBookTicket = (movie: Movie, showtime: Showtime) => {
    setSelectedMovie(null);
    setBookingData({ movie, showtime });
  };

  const handleConfirmBooking = (booking: Booking) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt vé!');
      setShowAuthModal(true);
      return;
    }

    setPendingBooking(booking);
    setBookingData(null);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    if (pendingBooking) {
      if (paymentMethod === 'wallet') {
        const success = deductBalance(pendingBooking.totalPrice);
        if (!success) {
          alert('Số dư không đủ!');
          return;
        }
      }

      addBooking(pendingBooking);
      setPendingBooking(null);
      setShowPaymentModal(false);
      alert('Đặt vé thành công! Vui lòng kiểm tra email để nhận thông tin vé.');
    }
  };

  const handleLogin = (email: string, password: string) => {
    login(email, password);
    setShowAuthModal(false);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    register(name, email, password);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowAccountModal(false);
  };

  const handleTopUp = (amount: number) => {
    topUpBalance(amount);
  };

  const handleBookNow = (movie: Movie) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setSelectedMovie(movie);
  };

  const handleWatchTrailer = () => {
    alert('Trailer sẽ được phát tại đây!');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        user={currentUser}
        onAuthClick={() => setShowAuthModal(true)}
        onAccountClick={() => setShowAccountModal(true)}
        onShowtimesClick={() => setShowShowtimesModal(true)}
        onPromotionsClick={() => setShowPromotionsModal(true)}
      />


      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {currentUser && (
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          user={currentUser}
          bookings={bookings.filter(b => b.userEmail === currentUser.email)}
          onTopUp={handleTopUp}
          onLogout={handleLogout}
        />
      )}

      {pendingBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={pendingBooking}
          userBalance={currentUser?.balance || 0}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <PromotionsModal
        isOpen={showPromotionsModal}
        onClose={() => setShowPromotionsModal(false)}
        promotions={promotions}
      />

      <ShowtimesModal
        isOpen={showShowtimesModal}
        onClose={() => setShowShowtimesModal(false)}
        movies={movies}
        showtimes={showtimes}
        onBookTicket={handleBookTicket}
      />
      {!searchQuery && !selectedGenre && (
        <HeroSection
          featuredMovie={featuredMovie}
          onWatchTrailer={handleWatchTrailer}
          onBookNow={handleBookNow}
        />
      )}

      <div className="container mx-auto px-4 py-12">
        <FilterBar
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {!searchQuery && !selectedGenre ? (
          <>
            <MovieSection
              title="🔥 Phim Hot"
              movies={popularMovies}
              onMovieClick={handleMovieClick}
            />

            <MovieSection
              title="💡 Đề xuất cho bạn"
              movies={recommendedMovies}
              onMovieClick={handleMovieClick}
            />

            <MovieSection
              title="🎬 Tất cả phim"
              movies={movies}
              onMovieClick={handleMovieClick}
            />
          </>
        ) : (
          <MovieSection
            title={
              searchQuery
                ? `Kết quả tìm kiếm: "${searchQuery}"`
                : `Thể loại: ${selectedGenre}`
            }
            movies={filteredMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {filteredMovies.length === 0 && (searchQuery || selectedGenre) && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Không tìm thấy phim nào phù hợp với tìm kiếm của bạn.
            </p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          showtimes={getMovieShowtimes(selectedMovie.id)}
          onClose={() => setSelectedMovie(null)}
          onBookTicket={handleBookTicket}
        />
      )}

      {bookingData && (
        <BookingModal
          movie={bookingData.movie}
          showtime={bookingData.showtime}
          onClose={() => setBookingData(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}
    </div>
  );
}

export default App;