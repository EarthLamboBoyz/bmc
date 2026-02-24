
import axios from 'axios';
import { getAuthHeader } from './auth.service';
import { API_URL } from '../config';

export const dashboardService = {
    getBrandStats: async () => {
        const response = await axios.get(`${API_URL}/dashboard/brand`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCreatorStats: async () => {
        const response = await axios.get(`${API_URL}/dashboard/creator`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
