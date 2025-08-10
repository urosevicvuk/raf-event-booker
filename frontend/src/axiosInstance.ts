import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios default config
const config = {
    baseURL: 'http://localhost:8081/api', // Base URL for our backend
    timeout: 60000, // Timeout (optional) how long we wait for response
    headers: {
        'Content-Type': 'application/json', // Default Content-Type
    },
};

// Creating Axios instance
const _axios: AxiosInstance = axios.create(config);

// Interceptor for request: adding Authorization header
// Used to add JWT token to Authorization header, works by checking if JWT token exists in local storage before each request
_axios.interceptors.request.use(
    (request) => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            request.headers.Authorization = `Bearer ${jwt}`; // Adding JWT token
        }
        return request;
    },
    (error: AxiosError) => {
        // Handle error before sending request
        return Promise.reject(error);
    }
);

// Interceptor for response: managing errors and good responses
_axios.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return response if successful
        return response;
    },
    (error: AxiosError) => {
        // If error is 401, redirect to login
        if (error.response && error.response.status === 401) {
            const navigate = useNavigate();
            navigate('/login'); // Redirect to login page
        }
        return Promise.reject(error);
    }
);

// Export Axios instance for use in application
export default _axios;