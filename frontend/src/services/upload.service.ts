
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/upload`;

export const uploadService = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');

        const response = await axios.post(`${API_URL}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.url;
    },

    uploadVideo: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('video', file);

        const token = localStorage.getItem('token');

        const response = await axios.post(`${API_URL}/video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.url;
    }
};
