import axios, {type AxiosResponse, AxiosError } from 'axios';
import type {PaginatedResponse} from '../types';

const API_BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL FIX: Send cookies for session management
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Utility function to extract data from paginated responses
export const extractResponseData = <T>(response: PaginatedResponse<T>): T[] => {
  return response.items || response.events || response.users || 
         response.categories || response.comments || [];
};

// Enhanced error handling utility
export const handleApiError = (error: any, userMessage?: string): string => {
  console.error('API Error:', error);
  const message = userMessage || 
                  error.response?.data?.message || 
                  'An error occurred. Please try again.';
  return message;
};

export default axiosInstance;