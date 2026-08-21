import apiClient, { unwrap } from './client';
import type { Category, ApiResponse } from '@/types';

export interface CreateCategoryData {
  name: string;
  description: string;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export const categoriesApi = {
  getAll: () => apiClient.get<ApiResponse<Category[]>>('/categories').then(unwrap),

  getById: (id: string) => apiClient.get<ApiResponse<Category>>(`/categories/${id}`).then(unwrap),

  create: (data: CreateCategoryData) =>
    apiClient.post<ApiResponse<Category>>('/categories', data).then(unwrap),

  update: (id: string, data: UpdateCategoryData) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data).then(unwrap),

  delete: (id: string) =>
    apiClient
      .delete<ApiResponse<{ message: string; category: Category }>>(`/categories/${id}`)
      .then(unwrap),
};

export default categoriesApi;
