import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/applications`;

export const applicationService = {
    // Creator: Apply to a campaign
    apply: async (token: string, campaignId: string, message?: string) => {
        const response = await axios.post(
            `${API_URL}/apply`,
            { campaignId, message },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Creator: Get my applications
    getMyApplications: async (token: string) => {
        const response = await axios.get(
            `${API_URL}/my-applications`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Brand: Get applications for a campaign
    getCampaignApplications: async (token: string, campaignId: string) => {
        const response = await axios.get(
            `${API_URL}/campaign/${campaignId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    },

    // Brand: Update application status
    updateStatus: async (token: string, applicationId: string, status: 'APPROVED' | 'REJECTED') => {
        const response = await axios.patch(
            `${API_URL}/${applicationId}/status`,
            { status },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    }
};
