import React from 'react';
import { X, Gift, Calendar, Copy } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotions: Promotion[];
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
  isOpen,
  onClose,
  promotions
}) => {
  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã copy mã: ${code}`);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gray-800 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="h-8 w-8 text-red-500" />
              <h2 className="text-2xl font-bold text-white">Khuyến mãi hot</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={promotion.image}
                      alt={promotion.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{promotion.discount}%
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{promotion.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{promotion.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Đến {new Date(promotion.validUntil).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs">Mã khuyến mãi</p>
                        <p className="text-white font-bold">{promotion.code}</p>
                      </div>
                      <button
                        onClick={() => copyCode(promotion.code)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};