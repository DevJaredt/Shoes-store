import apiClient, { unwrap } from './client';
import type { User, ApiResponse } from '@/types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role: 'admin' | 'customer';
}

export type UpdateUserData = Partial<CreateUserData>;

export const usersApi = {
  getAll: () => apiClient.get<ApiResponse<User[]>>('/users').then(unwrap),

  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`).then(unwrap),

  create: (data: CreateUserData) => apiClient.post<ApiResponse<User>>('/users', data).then(unwrap),

  update: (id: string, data: UpdateUserData) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data).then(unwrap),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string; user: User }>>(`/users/${id}`).then(unwrap),
};

export default usersApi;
