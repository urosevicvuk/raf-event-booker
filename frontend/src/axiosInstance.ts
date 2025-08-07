import axios, {type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios default config
const config: AxiosRequestConfig = {
  baseURL: 'http://localhost:8081', // Base URL for our backend
  timeout: 60000, // Timeout (optional) - max time to wait for response
  headers: {
    'Content-Type': 'application/json', // Default Content-Type
  },
};

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create(config);

// Request interceptor: add Authorization header
// Used to add JWT token in Authorization header, works by checking for JWT token in local storage before each request
axiosInstance.interceptors.request.use(
  (request) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      request.headers.Authorization = `Bearer ${jwt}`; // Add JWT token
    }
    return request;
  },
  (error: AxiosError) => {
    // Handle error before sending request
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors and successful responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response if successful
    return response;
  },
  (error: AxiosError) => {
    // If error is 401, redirect to login
    if (error.response && error.response.status === 401) {
      // Remove invalid token
      localStorage.removeItem('jwt');
      // Redirect to login page
      const navigate = useNavigate();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

// Export Axios instance for use in the application
export default axiosInstance;