import axiosInstance from './api';
import type {User, UserFormData} from '../types';

export class UserService {
  static async getAllUsers(userType?: string, activeOnly: boolean = true): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users', {
      params: { type: userType, active: activeOnly }
    });
    return response.data;
  }

  static async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }

  static async getUserByEmail(email: string): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/email/${email}`);
    return response.data;
  }

  static async createUser(user: UserFormData): Promise<User> {
    const response = await axiosInstance.post<User>('/users', user);
    return response.data;
  }

  static async updateUser(id: number, user: Partial<UserFormData>): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, user);
    return response.data;
  }

  static async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  }

  static async activateUser(id: number): Promise<{ message: string; user: User }> {
    const response = await axiosInstance.put(`/users/${id}/activate`);
    return response.data;
  }

  static async deactivateUser(id: number): Promise<{ message: string; user: User }> {
    const response = await axiosInstance.put(`/users/${id}/deactivate`);
    return response.data;
  }

  static async changePassword(
    id: number, 
    newPassword: string, 
    confirmPassword: string
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    const response = await axiosInstance.put(`/users/${id}/password`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }
}

export default UserService;