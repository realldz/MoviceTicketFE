import React, { useState } from 'react';
import { X, CreditCard, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import { Booking, PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  userBalance: number;
  onPaymentSuccess: (paymentMethod: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  userBalance,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('wallet');
  const [showQR, setShowQR] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!isOpen) return null;

  const paymentMethods: PaymentMethod[] = [
    { id: 'wallet', type: 'wallet', name: 'Ví CinemaBook', icon: '💳' },
    { id: 'qr_momo', type: 'qr', name: 'MoMo QR', icon: '📱' },
    { id: 'qr_zalopay', type: 'qr', name: 'ZaloPay QR', icon: '💙' },
    { id: 'qr_banking', type: 'qr', name: 'Banking QR', icon: '🏦' },
    { id: 'card', type: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳' }
  ];

  const handlePayment = () => {
    if (selectedMethod === 'wallet' && userBalance < booking.totalPrice) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền!');
      return;
    }

    if (selectedMethod.startsWith('qr_')) {
      setShowQR(true);
      // Simulate QR payment process
      setTimeout(() => {
        setShowQR(false);
        setPaymentComplete(true);
        setTimeout(() => {
          onPaymentSuccess(selectedMethod);
        }, 2000);
      }, 3000);
    } else {
      setPaymentComplete(true);
      setTimeout(() => {
        onPaymentSuccess(selectedMethod);
      }, 2000);
    }
  };

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-300">Vé của bạn đã được xác nhận</p>
        </div>
      </div>
    );
  }

  if (showQR) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Quét mã QR để thanh toán</h2>
          <div className="bg-white p-4 rounded-lg mb-6 mx-auto w-64 h-64 flex items-center justify-center">
            <QrCode className="h-48 w-48 text-gray-800" />
          </div>
          <p className="text-gray-300 mb-4">Số tiền: ${booking.totalPrice.toFixed(2)}</p>
          <p className="text-gray-400 text-sm">Đang chờ thanh toán...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Thanh toán</h2>
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Thông tin đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Booking ID:</span>
                <span className="text-white">#{booking.id}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Ghế đã chọn:</span>
                <span className="text-white">{booking.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Số lượng vé:</span>
                <span className="text-white">{booking.seats.length} vé</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Tổng tiền:</span>
                  <span className="text-red-400">${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Chọn phương thức thanh toán</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">{method.name}</span>
                    {method.id === 'wallet' && (
                      <div className="text-sm text-gray-400">
                        Số dư: ${userBalance.toFixed(2)}
                        {userBalance < booking.totalPrice && (
                          <span className="text-red-400 ml-2">(Không đủ số dư)</span>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="h-5 w-5 text-red-500" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Thanh toán ${booking.totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};