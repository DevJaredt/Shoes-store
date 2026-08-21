import { useEffect, useState, useCallback } from 'react';
import { productsApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import type { Product } from '@/types';
import type { CreateProductData, UpdateProductData } from '@/api/products';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: CreateProductData) => {
    const product = await productsApi.create(data);
    setProducts((prev) => [...prev, product]);
    return product;
  };

  const updateProduct = async (id: string, data: UpdateProductData) => {
    const product = await productsApi.update(id, data);
    setProducts((prev) => prev.map((p) => (p._id === id ? product : p)));
    return product;
  };

  const deleteProduct = async (id: string) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
