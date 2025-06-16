import { supabase } from '@/integrations/supabase/client';

/**
 * Unsets the default flag for all addresses of the specified user
 */
const unsetDefaultAddresses = async (userId: string, exceptId?: string): Promise<void> => {
  let query = supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);

  if (exceptId) {
    query = query.neq('id', exceptId);
  }

  const { error } = await query;
  if (error) {
    console.error('Error unsetting default addresses:', error);
    throw error;
  }
};

export type Address = {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export const getAddresses = async (): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return data || [];
};

export const addAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Check if this is the user's first address
  const { count, error: countError } = await supabase
    .from('user_addresses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (countError) {
    console.error('Error counting addresses:', countError);
    throw countError;
  }

  // Only the very first address is default
  const isDefault = (count === 0);
  console.log(`[addAddress] Existing address count:`, count, '| Will insert as default?', isDefault);

  // Safety: never allow is_default: true if not first address
  const insertAddress = {
    ...address,
    user_id: user.id,
    is_default: isDefault ? true : false
  };

  const { data, error } = await supabase
    .from('user_addresses')
    .insert([insertAddress])
    .select()
    .single();

  if (error) {
    console.error('Error adding address:', error, '| Insert attempted:', insertAddress);
    throw error;
  }

  return data;
};

export const updateAddress = async (id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>): Promise<Address> => {
  // If this update includes setting is_default to true, we need to unset other defaults first
  if (updates.is_default === true) {
    // First get the current address to get the user_id
    const { data: currentAddress } = await supabase
      .from('user_addresses')
      .select('user_id')
      .eq('id', id)
      .single();

    if (currentAddress?.user_id) {
      await unsetDefaultAddresses(currentAddress.user_id, id);
    }
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }

  return data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Atomically set default address using Supabase RPC
export const setDefaultAddress = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.rpc('set_default_address', {
    p_user_id: user.id,
    p_address_id: id,
  });
  if (error) {
    console.error('Error setting default address via RPC:', error);
    throw error;
  }
};
