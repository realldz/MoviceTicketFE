import { User } from "../types/api";
import axiosClient from './axiosClient';

const userApi = {
    getMe: (): Promise<User> => {
        const url = '/User/info';
        return axiosClient.get(url);
    }
}

export default userApi;