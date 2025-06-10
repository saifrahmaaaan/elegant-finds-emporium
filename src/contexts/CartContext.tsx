
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartState } from '@/types/cart';

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

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
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
      const items = action.payload;
      return {
        ...state,
        items,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        total: items.reduce((total, item) => total + (item.price * item.quantity), 0),
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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('elegantHandbagCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('elegantHandbagCart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
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
