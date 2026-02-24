import axios from 'axios';
import { getAuthHeader } from './auth.service';
import { API_URL } from '../config';

export interface PaymentSettings {
    paymentMethod: 'PROMPTPAY' | 'BANK_TRANSFER';
    promptpayId?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
}

export interface Transaction {
    id: string;
    brandName?: string; // For creator view
    creatorName?: string; // For brand view
    creatorAvatar?: string;
    campaignName: string;
    amount: number;
    paymentMethod?: string;
    promptpayId?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountName?: string;
    status: 'PENDING' | 'PAID' | 'CONFIRMED' | 'DISPUTED';
    dueDate?: string;
    transferDate?: string;
    slipImageUrl?: string;
    brandNote?: string;
    creatorNote?: string;
}

export const transactionService = {
    // Creator Methods
    updatePaymentSettings: async (settings: PaymentSettings) => {
        const response = await axios.post(`${API_URL}/payment/creator/payment-settings`, settings, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCreatorPendingPayments: async () => {
        const response = await axios.get(`${API_URL}/payment/creator/pending-payments`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    confirmTransaction: async (id: string, confirmed: boolean, note?: string) => {
        const response = await axios.post(`${API_URL}/payment/creator/transactions/${id}/confirm`, {
            confirmed,
            note
        }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Brand Methods
    getBrandPendingPayments: async () => {
        const response = await axios.get(`${API_URL}/payment/brand/pending-payments`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    },

    uploadPaymentProof: async (id: string, proofImageUrl: string, transferDate: string, note?: string) => {
        const response = await axios.post(`${API_URL}/payment/brand/transactions/${id}/upload-proof`, {
            proofImageUrl,
            transferDate,
            note
        }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCreatorPaymentInfo: async (creatorId: string) => {
        const response = await axios.get(`${API_URL}/payment/brand/creator/${creatorId}/payment-info`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    }
};
