import { useEffect, useState, useCallback } from 'react';
import { categoriesApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import type { Category } from '@/types';
import type { CreateCategoryData, UpdateCategoryData } from '@/api/categories';

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data: CreateCategoryData) => {
    const category = await categoriesApi.create(data);
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory = async (id: string, data: UpdateCategoryData) => {
    const category = await categoriesApi.update(id, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? category : c)));
    return category;
  };

  const deleteCategory = async (id: string) => {
    await categoriesApi.delete(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
