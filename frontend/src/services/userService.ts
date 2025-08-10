import _axios from '../axiosInstance';
import type { User, ApiResponse } from '../types';

export const userService = {
    // Get all users with optional filtering
    getAllUsers: async (userType?: string, active?: boolean): Promise<User[]> => {
        let url = '/users';
        const params: string[] = [];
        
        if (userType) params.push(`type=${userType}`);
        if (active !== undefined) params.push(`active=${active}`);
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        
        const response = await _axios.get(url);
        return response.data;
    },

    // Create new user
    createUser: async (userData: User): Promise<User> => {
        const response = await _axios.post('/users', userData);
        return response.data;
    },

    // Get user by ID
    getUserById: async (id: number): Promise<User> => {
        const response = await _axios.get(`/users/${id}`);
        return response.data;
    },

    // Get user by email
    getUserByEmail: async (email: string): Promise<User> => {
        const response = await _axios.get(`/users/email/${email}`);
        return response.data;
    },

    // Update user
    updateUser: async (id: number, userData: User): Promise<User> => {
        const response = await _axios.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    deleteUser: async (id: number): Promise<ApiResponse> => {
        const response = await _axios.delete(`/users/${id}`);
        return response.data;
    },

    // Activate user
    activateUser: async (id: number): Promise<ApiResponse> => {
        const response = await _axios.put(`/users/${id}/activate`);
        return response.data;
    },

    // Deactivate user
    deactivateUser: async (id: number): Promise<ApiResponse> => {
        const response = await _axios.put(`/users/${id}/deactivate`);
        return response.data;
    },

    // Change password
    changePassword: async (id: number, newPassword: string, confirmPassword: string): Promise<ApiResponse> => {
        const formData = new FormData();
        formData.append('newPassword', newPassword);
        formData.append('confirmPassword', confirmPassword);
        
        const response = await _axios.put(`/users/${id}/password`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};