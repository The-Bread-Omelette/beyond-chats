import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => {
        // Add a small delay for demo purposes if needed to show loading states pleasantly? 
        // Nah, let's keep it fast.
        return response;
    },
    (error) => {
        // Standardize error format
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';

        // Log for debugging
        console.error('API Error:', message, error);

        return Promise.reject(new Error(message));
    }
);

export default apiClient;
