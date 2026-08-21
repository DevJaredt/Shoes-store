import apiClient, { unwrap } from './client';
import type { User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials).then(unwrap),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<User>>('/auth/register', data).then(unwrap),
};

export default authApi;
