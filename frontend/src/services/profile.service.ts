import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/profiles`;

export const profileService = {
    getBrandProfile: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/brand/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getCreatorProfile: async (id: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/creator/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
