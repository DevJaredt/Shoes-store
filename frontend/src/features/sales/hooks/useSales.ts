import { useEffect, useState, useCallback } from 'react';
import { salesApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import type { Sale } from '@/types';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await salesApi.getAll();
      setSales(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { sales, isLoading, error, refetch: fetchSales };
}
