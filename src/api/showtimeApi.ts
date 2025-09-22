import axiosClient from './axiosClient';
import { ShowtimeResponseDto, SeatAvailabilityDto } from '../types/api';

const showtimeApi = {
    getAll: (params?: any): Promise<ShowtimeResponseDto[]> => {
        const url = '/Showtime';
        return axiosClient.get(url, { params });
    },

    getByMovieId: (movieId: string): Promise<ShowtimeResponseDto[]> => {
        const url = `/Showtime/movie/${movieId}`;
        return axiosClient.get(url);
    },

    getAvailableByMovie: (movieId: string, showDate?: string): Promise<ShowtimeResponseDto[]> => {
        const url = `/Showtime/available/${movieId}`;
        return axiosClient.get(url, { params: { showDate } });
    },

    getSeats: (id: string): Promise<SeatAvailabilityDto> => {
        const url = `/Showtime/${id}/seats`;
        return axiosClient.get(url);
    },
};

export default showtimeApi;