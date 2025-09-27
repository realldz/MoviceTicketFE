import React, { useState } from 'react';
import { X, User, Wallet, CreditCard, History, Settings, Plus } from 'lucide-react';
import { User as UserType, Booking } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  bookings: Booking[];
  onTopUp: (amount: number) => void;
  onLogout: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  bookings,
  onTopUp,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [topUpAmount, setTopUpAmount] = useState('');

  if (!isOpen) return null;

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      onTopUp(amount);
      setTopUpAmount('');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin', icon: User },
    // { id: 'wallet', label: 'Ví tiền', icon: Wallet },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Tài khoản của tôi</h2>
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-white font-semibold">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={onLogout}
              className="w-full mt-8 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
            >
              Đăng xuất
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Thông tin cá nhân</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Ví tiền</h3>
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Số dư hiện tại</p>
                      <p className="text-white text-3xl font-bold">${user.balance.toFixed(2)}</p>
                    </div>
                    <Wallet className="h-12 w-12 text-red-200" />
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Nạp tiền
                  </h4>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Nhập số tiền"
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                    <button
                      onClick={handleTopUp}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Nạp tiền
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[10, 20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount.toString())}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Lịch sử đặt vé</h3>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Booking #{booking.id}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${booking.status === 'confirmed'
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                            }`}>
                            {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">Ghế: {booking.seats.join(', ')}</p>
                        <p className="text-gray-300 text-sm">Tổng tiền: ${booking.totalPrice.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Chưa có lịch sử đặt vé nào</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Cài đặt</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Thông báo</h4>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox text-red-600" defaultChecked />
                      <span className="text-gray-300">Nhận thông báo về phim mới</span>
                    </label>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Ngôn ngữ</h4>
                    <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};