import apiClient, { unwrap } from './client';
import type { InventoryMovement, ApiResponse } from '@/types';

export interface CreateInventoryMovementData {
  product: string;
  type: 'entry' | 'exit' | 'adjustment';
  size: number;
  color: string;
  quantity: number;
  reason?: string;
}

export const inventoryApi = {
  getAll: () => apiClient.get<ApiResponse<InventoryMovement[]>>('/inventory-movements').then(unwrap),

  getByProduct: (productId: string) =>
    apiClient
      .get<ApiResponse<InventoryMovement[]>>(`/inventory-movements/product/${productId}`)
      .then(unwrap),

  create: (data: CreateInventoryMovementData) =>
    apiClient.post<ApiResponse<InventoryMovement>>('/inventory-movements', data).then(unwrap),
};

export default inventoryApi;
