import { useEffect, useState, useCallback } from 'react';
import {
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  PaymentMethod
} from '@/services/walletService';

export function useWallet() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentMethods();
      setMethods(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      await addPaymentMethod(method);
      await refresh();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const edit = async (id: string, updates: Partial<Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    try {
      await updatePaymentMethod(id, updates);
      await refresh();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    try {
      await deletePaymentMethod(id);
      await refresh();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id: string) => {
    setLoading(true);
    try {
      await setDefaultPaymentMethod(id);
      await refresh();
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    methods,
    loading,
    error,
    create,
    edit,
    remove,
    setDefault,
    refresh
  };
}
