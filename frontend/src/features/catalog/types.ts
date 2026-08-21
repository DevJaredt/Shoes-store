import type { Product, Category } from '@/types';

export interface ProductFilters {
  category?: string;
  search?: string;
}

export interface UseCatalogReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
