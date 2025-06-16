import { useState, useEffect, useCallback } from 'react';
import { Address, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress as setDefaultAddressApi } from '@/services/addressService';

export const useAddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch addresses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAddress = await addAddress(addressData);
      await fetchAddresses(); // Force refresh after add
      setError(null);
      // Log all addresses for debugging
      console.log('Addresses after add:', await getAddresses());
      return newAddress;
    } catch (err) {
      console.error('Failed to create address:', err);
      setError(err instanceof Error ? err : new Error('Failed to create address'));
      throw err;
    }
  };

  const editAddress = async (id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const updatedAddress = await updateAddress(id, updates);
      await fetchAddresses(); // Force refresh after edit
      setError(null);
      // Log all addresses for debugging
      console.log('Addresses after edit:', await getAddresses());
      return updatedAddress;
    } catch (err) {
      console.error('Failed to update address:', err);
      setError(err instanceof Error ? err : new Error('Failed to update address'));
      throw err;
    }
  };

  const removeAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      await fetchAddresses(); // Force refresh after delete
      setError(null);
      // Log all addresses for debugging
      console.log('Addresses after delete:', await getAddresses());
    } catch (err) {
      console.error('Failed to delete address:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete address'));
      throw err;
    }
  };

  const setDefault = async (id: string) => {
    try {
      await setDefaultAddressApi(id);
      await fetchAddresses(); // Force refresh after set default
      setError(null);
      // Log all addresses for debugging
      console.log('Addresses after setDefault:', await getAddresses());
    } catch (err) {
      console.error('Failed to set default address:', err);
      setError(err instanceof Error ? err : new Error('Failed to set default address'));
      throw err;
    }
  };

  return {
    addresses,
    loading,
    error,
    createAddress,
    editAddress,
    deleteAddress: removeAddress,
    setDefaultAddress: setDefault,
    refresh: fetchAddresses,
  };
};

export default useAddressBook;
