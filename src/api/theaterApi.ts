import { Theater } from '../types/api';
import axiosClient from './axiosClient';

const theaterApi = {
    getAll: (): Promise<Theater[]> => {
        const url = '/Theater';
        return axiosClient.get(url);
    },
};

export default theaterApi;