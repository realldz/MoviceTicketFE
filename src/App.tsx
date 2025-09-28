import { useState, useCallback, useEffect } from 'react';
import { Movie, Showtime, Booking } from './types/api';
import { useMovieData } from './hooks/useMovieData';
import { Header } from './components/Header';
import { MovieSection } from './components/MovieSection';
import { FilterBar } from './components/FilterBar';
import { MovieDetail } from './components/MovieDetail';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { PaymentModal } from './components/PaymentModal';
import { PromotionsModal } from './components/PromotionsModal';
import { ShowtimesModal } from './components/ShowtimesModal';
import { MovieResponseDto, Theater } from './types/api';
import { X } from 'lucide-react';

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
    // getPopularMovies,
    getRecommendedMovies,
    getMovieShowtimes,
    searchMovies,
    getTheaters
  } = useMovieData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieResponseDto | null>(null);
  const [selectedMovieShowtimes, setSelectedMovieShowtimes] = useState<Showtime[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);

  useEffect(() => {
    if (selectedMovie) {
      getMovieShowtimes(selectedMovie.id).then(setSelectedMovieShowtimes);
    } else {
      setSelectedMovieShowtimes([]);
    }
  }, [selectedMovie, getMovieShowtimes]);

  useEffect(() => {
    const fetchTheaters = async () => {
      const theaters = await getTheaters();
      setTheaters(theaters);
    };
    fetchTheaters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [bookingData, setBookingData] = useState<{
    movie: Movie;
    showtime: Showtime;
    theater: Theater;
  } | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showShowtimesModal, setShowShowtimesModal] = useState(false);
  const [authError, setAuthError] = useState<string | string[] | null>(null);
  const [successfulBooking, setSuccessfulBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
    const vnp_TxnRef = urlParams.get('vnp_TxnRef');

    if (vnp_ResponseCode === '00' && vnp_TxnRef) {
      const storedBooking = localStorage.getItem(`booking-${vnp_TxnRef}`);
      if (storedBooking) {
        const booking = JSON.parse(storedBooking) as Booking;
        addBooking(booking);
        setSuccessfulBooking(booking);
        localStorage.removeItem(`booking-${vnp_TxnRef}`);
        // Clean up the URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [addBooking]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);


  // const popularMovies = getPopularMovies();
  // const recommendedMovies = getRecommendedMovies();
  // const featuredMovie = popularMovies[0] || movies[0];

  const filteredMovies = searchQuery || selectedGenre
    ? searchMovies(searchQuery, selectedGenre)
    : movies;

  const handleMovieClick = (movie: MovieResponseDto) => {
    setSelectedMovie(movie);
  };

  const handleBookTicket = (movie: MovieResponseDto, showtime: Showtime, theater: Theater) => {
    setSelectedMovie(null);
    setBookingData({ movie, showtime, theater });
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
        const success = deductBalance(pendingBooking.totalAmount);
        if (!success) {
          alert('Số dư không đủ!');
          return;
        }
      }

      addBooking(pendingBooking);
      setPendingBooking(null);
      setShowPaymentModal(false);
      // alert('Đặt vé thành công! Vui lòng kiểm tra email để nhận thông tin vé.');
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const result = await login(email, password);
    if (result.error) {
      setAuthError(result.error);
      return false;
    } else {
      setShowAuthModal(false);
      setAuthError(null); // Clear error on success
      return true;
    }
  };

  const handleRegister = async (name: string, email: string, password: string): Promise<boolean> => {
    const result = await register(name, email, password);
    if (result.error) {
      setAuthError(result.error);
      return false;
    } else {
      // On successful registration, we won't close the modal immediately.
      // We will let the AuthModal handle the UI transition.
      setAuthError(null);
      return true;
    }
  };

  const handleLogout = () => {
    logout();
    setShowAccountModal(false);
  };

  const handleTopUp = (amount: number) => {
    topUpBalance(amount);
  };

  const handleBookNow = (movie: MovieResponseDto) => {
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
        onAuthClick={() => {
          setAuthError(null); // Clear previous errors
          setShowAuthModal(true);
        }}
        onAccountClick={() => setShowAccountModal(true)}
        onShowtimesClick={() => setShowShowtimesModal(true)}
        onPromotionsClick={() => setShowPromotionsModal(true)}
      />


      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
        clearError={clearAuthError}
      />

      {currentUser && (
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          user={currentUser}
          bookings={bookings.filter(b => b.userId === currentUser.id)}
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
      {/* {!searchQuery && !selectedGenre && (
        <HeroSection
          featuredMovie={featuredMovie}
          onWatchTrailer={handleWatchTrailer}
          onBookNow={handleBookNow}
        />
      )} */}

      <div className="container mx-auto px-4 py-12">
        <FilterBar
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {!searchQuery && !selectedGenre ? (
          <>
            {/* <MovieSection
              key="popular-movies"
              title="🔥 Phim Hot"
              movies={popularMovies}
              onMovieClick={handleMovieClick}
            /> */}

            {/* <MovieSection
              key="recommended-movies"
              title="💡 Đề xuất cho bạn"
              movies={recommendedMovies}
              onMovieClick={handleMovieClick}
            /> */}

            <MovieSection
              key="all-movies"
              title="🎬 Tất cả phim"
              movies={movies}
              onMovieClick={handleMovieClick}
            />
          </>
        ) : (
          <MovieSection
            key="filtered-movies"
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
          theaters={theaters}
          showtimes={selectedMovieShowtimes}
          onClose={() => setSelectedMovie(null)}
          onBookTicket={handleBookTicket}
        />
      )}

      {bookingData && (
        <BookingModal
          movie={bookingData.movie}
          showtime={bookingData.showtime}
          user={currentUser}
          theater={bookingData.theater}
          onClose={() => setBookingData(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {successfulBooking && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                Thanh toán thành công
              </h2>
              <button
                onClick={() => setSuccessfulBooking(null)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 text-white">
              <p className="text-center text-lg mb-6">Cảm ơn bạn đã đặt vé!</p>
              <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Mã vé:</span>
                  <span className="font-bold text-red-500">{`#${successfulBooking.id}`}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Phim:</span>
                  <span className="font-bold">{successfulBooking.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Rạp:</span>
                  <span>{successfulBooking.theaterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Suất chiếu:</span>
                  <span>{`${new Date(successfulBooking.showtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(successfulBooking.showtime).toLocaleDateString()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Ghế:</span>
                  <span>{successfulBooking.seats.join(', ')}</span>
                </div> */}
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex justify-between text-xl">
                  <span className="font-semibold text-gray-400">Tổng cộng:</span>
                  <span className="font-bold text-red-500">
                    {successfulBooking.totalAmount.toLocaleString('vi-VN')} $
                  </span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Thông tin chi tiết đã được gửi đến email của bạn.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;