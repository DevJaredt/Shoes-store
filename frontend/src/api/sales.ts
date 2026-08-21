import apiClient, { unwrap } from './client';
import type { Sale, ApiResponse } from '@/types';

export interface CreateSaleItem {
  product: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleData {
  items: CreateSaleItem[];
  discount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export const salesApi = {
  getAll: () => apiClient.get<ApiResponse<Sale[]>>('/sales').then(unwrap),

  getById: (id: string) => apiClient.get<ApiResponse<Sale>>(`/sales/${id}`).then(unwrap),

  create: (data: CreateSaleData) => apiClient.post<ApiResponse<Sale>>('/sales', data).then(unwrap),
};

export default salesApi;
