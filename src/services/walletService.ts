import { supabase } from '@/integrations/supabase/client';

export type PaymentMethod = {
  id?: string;
  user_id?: string;
  card_brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase
    .from('user_payment_methods')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<PaymentMethod> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { data, error } = await supabase
    .from('user_payment_methods')
    .insert({ ...method, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updatePaymentMethod = async (id: string, updates: Partial<Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>>): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from('user_payment_methods')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('user_payment_methods')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const setDefaultPaymentMethod = async (id: string): Promise<void> => {
  // Atomically set default card
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  // Unset all other defaults
  let { error } = await supabase
    .from('user_payment_methods')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)
    .neq('id', id);
  if (error) throw error;
  // Set this card as default
  ({ error } = await supabase
    .from('user_payment_methods')
    .update({ is_default: true })
    .eq('id', id));
  if (error) throw error;
};
