// Các kiểu dữ liệu này được tạo ra dựa trên OpenAPI spec bạn đã cung cấp.
// Chúng sẽ được sử dụng trong các file API và các component.

// =================================================================
// Các kiểu dữ liệu hiện có trong ứng dụng (cần được ánh xạ/thay thế)
// =================================================================

export interface Movie {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    trailerUrl: string;
    duration: number;
    releaseDate: string;
    genre: string;
    rating: number;
    director: string;
    cast: string;
}

export interface Showtime {
    id: string;
    movieId: string;
    theater: string;
    time: string;
    date: string;
    availableSeats: string[];
    price: number;
}

export interface Booking {
    id: string;
    userEmail: string;
    showtimeId: string;
    seats: string[];
    totalPrice: number;
    bookingDate: string;
    status: 'confirmed' | 'cancelled';
}

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
}

export interface Promotion {
    id: string;
    code: string;
    description: string;
    discount: number;
}

// =================================================================
// Các kiểu dữ liệu DTO từ OpenAPI (dùng để giao tiếp với API)
// =================================================================

// Authorization
export interface LoginRequest {
    email: string;
    password: string;
    twoFactorCode?: string | null;
    twoFactorRecoveryCode?: string | null;
}

export interface RegisterRequestDto {
    name: string;
    email: string;
    password: string;
}

// Movie
export interface MovieResponseDto {
    id?: string;
    title?: string;
    description?: string;
    duration?: number;
    genre?: string;
    director?: string;
    cast?: string;
    releaseDate?: string;
    posterUrl?: string;
    trailerUrl?: string;
    rating?: number;
    language?: string;
}

export interface MovieRequestDto extends Omit<MovieResponseDto, 'id'> { }

// Showtime
export interface ShowtimeResponseDto {
    id?: string;
    movieId?: string;
    screenId?: string;
    theaterId?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
    ticketPrice?: number;
    availableSeats?: number;
    bookedSeats?: string;
    status?: string;
}

export interface SeatAvailabilityDto {
    totalSeats?: number;
    availableSeats?: number;
    bookedSeatsCount?: number;
    bookedSeatsList?: string[];
}

// Booking
export interface BookingResponseDto {
    id?: string;
    userId?: string;
    showtimeId?: string;
    seatNumbers?: string[];
    bookingDate?: string;
    totalAmount?: number;
    paymentStatus?: string;
    bookingStatus?: string;
    bookingReference?: string;
}