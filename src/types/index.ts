// export interface Showtime {
//   id: string;
//   movieId: string;
//   time: string;
//   date: string;
//   theater: string;
//   availableSeats: number;
//   totalSeats: number;
//   price: number;
// }

export interface Seat {
    id: string;
    row: string;
    number: number;
    isAvailable: boolean;
    isSelected: boolean;
    type: 'regular' | 'premium' | 'vip';
}

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   balance: number;
//   bookingHistory: Booking[];
// }

// export interface PaymentMethod {
//   id: string;
//   type: 'qr' | 'card' | 'wallet';
//   name: string;
//   icon: string;
// }

// export interface Promotion {
//   id: string;
//   title: string;
//   description: string;
//   discount: number;
//   validUntil: string;
//   image: string;
//   code: string;
// }