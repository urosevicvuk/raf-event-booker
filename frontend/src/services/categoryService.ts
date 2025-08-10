import _axios from '../axiosInstance';
import type { Category, ApiResponse } from '../types';

export const categoryService = {
    // Get all categories
    getAllCategories: async (): Promise<Category[]> => {
        const response = await _axios.get('/categories');
        return response.data;
    },

    // Create new category
    createCategory: async (categoryData: Category): Promise<Category> => {
        const response = await _axios.post('/categories', categoryData);
        return response.data;
    },

    // Get category by ID
    getCategoryById: async (id: number): Promise<Category> => {
        const response = await _axios.get(`/categories/${id}`);
        return response.data;
    },

    // Delete category
    deleteCategory: async (id: number): Promise<ApiResponse> => {
        const response = await _axios.delete(`/categories/${id}`);
        return response.data;
    },
};