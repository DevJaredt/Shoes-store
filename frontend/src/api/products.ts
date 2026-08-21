import apiClient, { unwrap } from './client';
import type { Product, ApiResponse } from '@/types';

export interface CreateProductData {
  name: string;
  brand: string;
  category: string;
  description: string;
  purchasePrice: number;
  price: number;
  images: string[];
  variants: { size: number; color: string; stock: number }[];
}

export type UpdateProductData = Partial<CreateProductData>;

export const productsApi = {
  getAll: () => apiClient.get<ApiResponse<Product[]>>('/products').then(unwrap),

  getById: (id: string) => apiClient.get<ApiResponse<Product>>(`/products/${id}`).then(unwrap),

  create: (data: CreateProductData) =>
    apiClient.post<ApiResponse<Product>>('/products', data).then(unwrap),

  update: (id: string, data: UpdateProductData) =>
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, data).then(unwrap),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/products/${id}`).then(unwrap),
};

export default productsApi;
