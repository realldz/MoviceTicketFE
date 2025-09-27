import React, { useState } from 'react';
import { X, User, Mail, Phone } from 'lucide-react';
import { Movie, Showtime, Booking } from '../types/api';
import { Theater } from '../types/api';
import { Seat } from '../types';

interface BookingModalProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  movie,
  showtime,
  theater,
  onClose,
  onConfirmBooking
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Generate seats (simplified)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= 15; seatNum++) {
        const seatId = `${row}${seatNum}`;
        const isAvailable = Math.random() > 0.3; // 70% seats available
        const type = rowIndex < 2 ? 'premium' : rowIndex > 5 ? 'vip' : 'regular';

        seats.push({
          id: seatId,
          row,
          number: seatNum,
          isAvailable,
          isSelected: selectedSeats.includes(seatId),
          type
        });
      }
    });

    return seats;
  };

  const seats = generateSeats();

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatPrice = (type: string) => {
    const basePrice = showtime.ticketPrice;
    switch (type) {
      case 'premium': return basePrice * 1.5;
      case 'vip': return basePrice * 2;
      default: return basePrice;
    }
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return total + (seat ? getSeatPrice(seat.type) : 0);
  }, 0);

  const handleBooking = () => {
    if (selectedSeats.length === 0 || !customerInfo.name || !customerInfo.email) {
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      movieId: movie.id,
      showtimeId: showtime.id,
      seats: selectedSeats,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      userEmail: customerInfo.email
    };

    onConfirmBooking(booking);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gray-800 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <p className="text-gray-300">
                {theater.name} - {showtime.startTime} - {showtime.date}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Screen */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-600 to-gray-500 h-3 rounded-t-full mb-4 relative">
                <div className="text-center text-white text-sm py-1">MÀN HÌNH</div>
              </div>
            </div>

            {/* Seat Map */}
            <div className="mb-8">
              <div className="grid grid-cols-15 gap-1 max-w-4xl mx-auto">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => seat.isAvailable && toggleSeat(seat.id)}
                    disabled={!seat.isAvailable}
                    className={`
                      w-8 h-8 rounded text-xs font-bold border-2 transition-all
                      ${seat.isSelected
                        ? 'bg-red-500 border-red-400 text-white'
                        : seat.isAvailable
                          ? seat.type === 'premium'
                            ? 'bg-yellow-600 border-yellow-500 hover:bg-yellow-500 text-white'
                            : seat.type === 'vip'
                              ? 'bg-purple-600 border-purple-500 hover:bg-purple-500 text-white'
                              : 'bg-gray-600 border-gray-500 hover:bg-gray-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 border border-gray-500 rounded"></div>
                  <span className="text-gray-300">Thường (${showtime.price})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-600 border border-yellow-500 rounded"></div>
                  <span className="text-gray-300">Premium (${(showtime.price * 1.5).toFixed(2)})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-600 border border-purple-500 rounded"></div>
                  <span className="text-gray-300">VIP (${(showtime.price * 2).toFixed(2)})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 border border-red-400 rounded"></div>
                  <span className="text-gray-300">Đã chọn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                  <span className="text-gray-300">Đã đặt</span>
                </div>
              </div>
            </div>

            {/* Customer Info & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Info */}
              {/* <div>
                <h3 className="text-xl font-bold text-white mb-4">Thông tin khách hàng</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div> */}

              {/* Booking Summary */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tóm tắt đặt vé</h3>
                <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Phim:</span>
                    <span className="text-white">{movie.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Rạp:</span>
                    <span className="text-white">{theater.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Suất chiếu:</span>
                    <span className="text-white">{showtime.startTime} - {showtime.date}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Ghế đã chọn:</span>
                    <span className="text-white">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn ghế'}
                    </span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Tổng tiền:</span>
                      <span className="text-red-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0 || !customerInfo.name || !customerInfo.email}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};