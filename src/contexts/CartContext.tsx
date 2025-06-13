import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { CartItem, CartState } from '@/types/cart';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Validate Shopify variant ID format
const isValidVariantId = (id: string) => 
  id.startsWith('gid://shopify/ProductVariant/');

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (!isValidVariantId(action.payload.variantId)) {
        console.error('Invalid variant ID:', action.payload.variantId);
        return state;
      }

      const existingItem = state.items.find(item => item.variantId === action.payload.variantId);
      
      const updatedItems = existingItem
        ? state.items.map(item =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { ...action.payload, quantity: 1 }];

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.variantId !== action.payload);
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.variantId === action.payload.variantId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((total, item) => total + item.quantity, 0),
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        isOpen: false,
        itemCount: 0,
        total: 0,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'LOAD_CART': {
      const validItems = action.payload.filter(item => isValidVariantId(item.variantId));
      return {
        ...state,
        items: validItems,
        itemCount: validItems.reduce((total, item) => total + item.quantity, 0),
        total: validItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      };
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    itemCount: 0,
    total: 0,
  });
  const [cartLoaded, setCartLoaded] = React.useState(false);
  const { user } = useAuth();

  // Helper: Save cart to Supabase for logged-in user
  const saveCartToSupabase = useCallback(async (cartItems: CartItem[]) => {
    if (!user) return;
    try {
      await supabase.from('user_carts').upsert({
        user_id: user.id,
        cart: cartItems,
        updated_at: new Date().toISOString(),
      });
      console.log('[Cart] Saved to Supabase:', cartItems);
    } catch (e) {
      console.error('Failed to save cart to Supabase:', e);
    }
  }, [user]);

  // Helper: Load cart from Supabase for logged-in user
  const loadCartFromSupabase = useCallback(async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_carts')
      .select('cart')
      .eq('user_id', user.id)
      .single();
    if (error) {
      if (error.code !== 'PGRST116') // not found
        console.error('Error loading cart from Supabase:', error);
      return null;
    }
    return data?.cart || null;
  }, [user]);

  // Only load cart once per user session/auth change
  const prevUserRef = useRef<any>(null);

  useEffect(() => {
    const prevUser = prevUserRef.current;
    const isLoggingIn = !prevUser && user;
    const isSwitchingUser = user && prevUser && user.id !== prevUser.id;
    const isLoggingOut = prevUser && !user;
    // Always load Supabase cart on login, user switch, and page refresh (when user is present)
    (async () => {
      if (user) {
        const supabaseCart = await loadCartFromSupabase();
        let newCart: CartItem[] = [];
        // Merge guest cart ONLY if logging in and guest cart is non-empty
        if (isLoggingIn && cart.items.length > 0) {
          const guestItems = cart.items;
          const supabaseItems = Array.isArray(supabaseCart) ? supabaseCart : [];
          const itemMap = new Map<string, CartItem>();
          [...supabaseItems, ...guestItems].forEach(item => {
            if (!isValidVariantId(item.variantId)) return;
            if (itemMap.has(item.variantId)) {
              const existing = itemMap.get(item.variantId)!;
              itemMap.set(item.variantId, {
                ...existing,
                quantity: existing.quantity + item.quantity,
              });
            } else {
              itemMap.set(item.variantId, { ...item });
            }
          });
          newCart = Array.from(itemMap.values());
          await saveCartToSupabase(newCart);
          console.log('[Cart] Merged guest cart into Supabase on login', newCart);
        } else {
          newCart = Array.isArray(supabaseCart) ? supabaseCart : [];
          console.log('[Cart] Loaded cart from Supabase', newCart);
        }
        dispatch({ type: 'LOAD_CART', payload: newCart });
        setCartLoaded(true);
      } else if (isLoggingOut) {
        // Only clear cart on explicit user action, not on every logout
        dispatch({ type: 'LOAD_CART', payload: [] });
        setCartLoaded(true);
        console.log('[Cart] Guest session: empty cart');
      }
      prevUserRef.current = user;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save cart to Supabase (if logged in) whenever cart changes, but only after cartLoaded
  useEffect(() => {
    if (!cartLoaded) return;
    if (user) {
      saveCartToSupabase(cart.items);
      console.log('[Cart] Saved to Supabase (user only)', cart.items);
    }
  }, [cart.items, user, saveCartToSupabase, cartLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (!isValidVariantId(item.variantId)) {
      console.error('Attempted to add item with invalid variant ID:', item.variantId);
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: item });
  };


  const removeFromCart = (variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: variantId });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
