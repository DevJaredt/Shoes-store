import { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/api';
import { getErrorMessage } from '@/api/client';
import type { User } from '@/types';
import type { CreateUserData, UpdateUserData } from '@/api/users';

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: CreateUserData) => {
    const user = await usersApi.create(data);
    setUsers((prev) => [...prev, user]);
    return user;
  };

  const updateUser = async (id: string, data: UpdateUserData) => {
    const user = await usersApi.update(id, data);
    setUsers((prev) => prev.map((u) => (u._id === id ? user : u)));
    return user;
  };

  const deleteUser = async (id: string) => {
    await usersApi.delete(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
