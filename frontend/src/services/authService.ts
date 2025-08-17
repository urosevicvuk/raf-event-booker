import axiosInstance from './api';
import type {LoginRequest, LoginResponse, User} from '../types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/users/login', credentials);
    return response.data;
  }

  static async getUserByEmail(email: string): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/email/${email}`);
    return response.data;
  }

  static saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

