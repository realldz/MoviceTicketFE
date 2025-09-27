import axiosClient from './axiosClient';

// Các kiểu dữ liệu này sẽ được định nghĩa trong src/types.ts
import { LoginRequest, LoginResponse, RegisterRequestDto } from '../types/api';

const authApi = {
    login: (data: LoginRequest): Promise<LoginResponse> => {
        const url = '/Authorization/login';
        return axiosClient.post(url, data);
    },

    register: (data: RegisterRequestDto) => {
        const url = '/Authorization/register';
        return axiosClient.post(url, data);
    },
};

export default authApi;