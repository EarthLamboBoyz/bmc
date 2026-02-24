import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/campaigns`;

export const campaignService = {
    // Create a new campaign
    createCampaign: async (campaignData: any, token: string) => {
        const response = await axios.post(API_URL, campaignData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Get all campaigns (optional brandId filter or owner filter)
    getCampaigns: async (token: string, brandId?: string, owner?: boolean) => {
        const params: any = {};
        if (brandId) params.brandId = brandId;
        if (owner) params.owner = 'true';

        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });
        return response.data;
    },

    // Get campaign by ID
    getCampaignById: async (id: string, token: string) => {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Update campaign
    updateCampaign: async (id: string, campaignData: any, token: string) => {
        const response = await axios.put(`${API_URL}/${id}`, campaignData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // End campaign and calculate rewards
    endCampaign: async (id: string, token: string) => {
        const response = await axios.post(`${API_URL}/${id}/end`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Get campaigns the creator is approved for
    getMyCampaigns: async (token: string) => {
        const response = await axios.get(`${API_BASE_URL}/creator/my-campaigns`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};
