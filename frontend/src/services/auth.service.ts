import { API_BASE_URL } from '../config';
import { UserRole } from '../types';

const API_URL = `${API_BASE_URL}/auth`;

interface RegisterResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export const authService = {
    register: async (data: any): Promise<RegisterResponse> => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    updateProfile: async (data: any, token: string): Promise<any> => {
        const response = await fetch(`${API_URL}/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Update failed');
        }

        return response.json();
    },
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};
