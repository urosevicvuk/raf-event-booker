import axiosInstance from './api';
import type {Category, CategoryFormData, PaginatedResponse} from '../types';

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  }

  static async getCategoriesPaginated(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Category>> {
    const response = await axiosInstance.get<PaginatedResponse<Category>>('/categories/paginated', {
      params: { page, limit }
    });
    return response.data;
  }

  static async getCategoryById(id: number): Promise<Category> {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  }

  static async createCategory(category: CategoryFormData): Promise<Category> {
    const response = await axiosInstance.post<Category>('/categories', category);
    return response.data;
  }

  static async updateCategory(id: number, category: CategoryFormData): Promise<Category> {
    const response = await axiosInstance.put<Category>(`/categories/${id}`, category);
    return response.data;
  }

  static async deleteCategory(id: number): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  }
}

