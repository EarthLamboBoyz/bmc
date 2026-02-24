import { API_BASE_URL } from '../config';

// API_BASE_URL already includes /api
const API_URL = API_BASE_URL;

const getToken = () => localStorage.getItem('token');

export interface MyCampaign {
  id: string;
  title: string;
  brandName: string;
  image: string;
  status: 'active' | 'pending' | 'completed';
  progress: {
    current: number;
    total: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  videos: {
    submitted: number;
    approved: number;
  };
  earnings: {
    current: number;
    potential: number;
  };
  daysRemaining: number;
  deadline: string;
  submittedToday: boolean;
  submittedAt?: string;
  hoursRemaining?: number;
  minutesRemaining?: number;
}

export const creatorCampaignService = {
  // Get all campaigns for logged-in creator
  getMyCampaigns: async (): Promise<MyCampaign[]> => {
    const response = await fetch(`${API_URL}/creator/my-campaigns`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const data = await response.json();
    return data.campaigns;
  },

  // Get single campaign detail
  getMyCampaignDetail: async (campaignId: string) => {
    const response = await fetch(`${API_URL}/creator/my-campaigns/${campaignId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaign detail');
    }

    return response.json();
  },
};
