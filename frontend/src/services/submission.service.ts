import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/submissions`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const submissionService = {
    submitWork: async (data: {
        campaignId: string;
        contentUrl: string;
        promoLink?: string;
        day?: number;
        notes?: string;
        platform?: 'TikTok' | 'Instagram' | 'YouTube';
    }) => {
        const response = await axios.post(API_URL, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    getSubmissions: async (filters: {
        campaignId?: string;
        creatorId?: string;
        status?: string;
    }) => {
        const response = await axios.get(API_URL, {
            params: filters,
            headers: getAuthHeader(),
        });
        return response.data;
    },

    updateStatus: async (
        id: string,
        status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED',
        reason?: string
    ) => {
        const response = await axios.put(
            `${API_URL}/${id}/status`,
            { status, reason },
            {
                headers: getAuthHeader(),
            }
        );
        return response.data;
    },
};
