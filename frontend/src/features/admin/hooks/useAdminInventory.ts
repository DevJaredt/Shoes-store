import { useEffect, useState, useCallback } from 'react';
import { inventoryApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import type { InventoryMovement } from '@/types';
import type { CreateInventoryMovementData } from '@/api/inventory';

export function useAdminInventory() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getAll();
      setMovements(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const createMovement = async (data: CreateInventoryMovementData) => {
    const movement = await inventoryApi.create(data);
    setMovements((prev) => [movement, ...prev]);
    return movement;
  };

  return {
    movements,
    isLoading,
    error,
    refetch: fetchMovements,
    createMovement,
  };
}
