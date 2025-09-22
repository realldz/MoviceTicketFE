import axiosClient from './axiosClient';
import { BookingResponseDto } from '../types/api';

const bookingApi = {
    book: (params: { userId: string; showtimeId: string }, seatNumbers: string[]): Promise<BookingResponseDto> => {
        const url = '/Booking/book';
        return axiosClient.post(url, seatNumbers, { params });
    },

    getByUser: (userId: string): Promise<BookingResponseDto[]> => {
        const url = `/Booking/user/${userId}`;
        return axiosClient.get(url);
    },

    getByReference: (reference: string): Promise<BookingResponseDto> => {
        const url = `/Booking/reference/${reference}`;
        return axiosClient.get(url);
    },
};

export default bookingApi;