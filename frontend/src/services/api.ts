import axios, {type AxiosResponse, AxiosError } from 'axios';
import type {PaginatedResponse} from '../types';

const API_BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const extractResponseData = <T>(response: PaginatedResponse<T>): T[] => {
  return response.items || response.events || response.users || 
         response.categories || response.comments || [];
};

export const handleApiError = (error: any, userMessage?: string): string => {
  console.error('API Error:', error);
  const message = userMessage || 
                  error.response?.data?.message || 
                  'An error occurred. Please try again.';
  return message;
};

export default axiosInstance;