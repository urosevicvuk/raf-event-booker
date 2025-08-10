import _axios from '../axiosInstance';
import type { LoginRequest, LoginResponse } from '../types';

export const authService = {
    // Login user with email and password
    login: async (loginData: LoginRequest): Promise<LoginResponse> => {
        const response = await _axios.post('/users/login', loginData);
        return response.data;
    },
};