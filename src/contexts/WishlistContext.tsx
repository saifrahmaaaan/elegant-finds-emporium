import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/shopify';

export type WishlistItem = {
  productId: string;
  // Add more fields as needed (e.g., product snapshot)
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  reloadWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from Supabase for logged-in users
  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('wishlist')
      .eq('user_id', user.id)
      .single();
    if (error) {
      setWishlist([]);
    } else {
      setWishlist(data?.wishlist || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line
  }, [user]);

  // Save wishlist to Supabase
  const saveWishlist = async (items: WishlistItem[]) => {
    if (!user) return;
    await supabase
      .from('user_wishlists')
      .upsert({ user_id: user.id, wishlist: items, updated_at: new Date().toISOString() });
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!user) return;
    if (wishlist.some(w => w.productId === item.productId)) return;
    const updated = [...wishlist, item];
    setWishlist(updated);
    saveWishlist(updated);
  };

  const removeFromWishlist = (productId: string) => {
    if (!user) return;
    const updated = wishlist.filter(w => w.productId !== productId);
    setWishlist(updated);
    saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.some(w => w.productId === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading, reloadWishlist: loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
