import axiosClient from './axiosClient';
import { MovieRequestDto, MovieResponseDto } from '../types/api';

const movieApi = {
    getAll: (params?: any): Promise<MovieResponseDto[]> => {
        const url = '/Movie';
        return axiosClient.get(url, { params });
    },

    getById: (id: string): Promise<MovieResponseDto> => {
        const url = `/Movie/${id}`;
        return axiosClient.get(url);
    },

    search: (params: any): Promise<MovieResponseDto[]> => {
        const url = '/Movie/search';
        return axiosClient.get(url, { params });
    },

    create: (data: MovieRequestDto): Promise<MovieResponseDto> => {
        const url = '/Movie';
        return axiosClient.post(url, data);
    },

    // Các hàm update, delete có thể được thêm vào nếu cần
};

export default movieApi;