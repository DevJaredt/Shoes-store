import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types';

export const TOKEN_KEY = 'shoes_store_token';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    const data = response.data;
    const isWrapped =
      data && typeof data === 'object' && !Array.isArray(data) && 'success' in data;

    if (!isWrapped) {
      response.data = { success: true, data } as ApiResponse<unknown>;
    }
    return response as AxiosResponse<ApiResponse<unknown>>;
  },
  (error) => Promise.reject(error),
);

export function unwrap<T>(response: AxiosResponse<ApiResponse<T>>): T {
  return response.data.data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data && typeof data === 'object' && 'message' in data) {
      return data.message || 'Error en la solicitud';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
}

export default apiClient;

