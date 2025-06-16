import { useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useCartCheckoutHandler() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  return useCallback(async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to proceed to checkout.',
        variant: 'destructive',
      });
      return;
    }
    if (cart.items.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // Prepare line items
      const lineItems = cart.items
        .filter(item => item.variantId && item.quantity > 0)
        .map(item => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        }));
      if (lineItems.length === 0) {
        throw new Error('No valid items found in cart');
      }
      const cartMutation = `
        mutation cartCreate($cartInput: CartInput!) {
          cartCreate(input: $cartInput) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      // Set returnUrl based on environment
      let returnUrl = 'https://elegant-finds-emporium.lovable.app/';
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        returnUrl = 'http://localhost:8080/';
      }
      const { data, error } = await supabase.functions.invoke('shopify-products', {
        body: {
          query: cartMutation,
          variables: {
            cartInput: {
              lines: lineItems,
              attributes: [{ key: 'return_to', value: returnUrl }],
            },
          },
        },
      });
      if (error) {
        toast({
          title: 'Checkout Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      if (!data || !data.data) {
        toast({
          title: 'Checkout Error',
          description: 'No response from checkout API.',
          variant: 'destructive',
        });
        return;
      }
      const cartData = data.data.cartCreate;
      if (cartData.userErrors && cartData.userErrors.length > 0) {
        toast({
          title: 'Checkout Error',
          description: cartData.userErrors.map((e: any) => e.message).join(', '),
          variant: 'destructive',
        });
        return;
      }
      if (!cartData.cart || !cartData.cart.checkoutUrl) {
        toast({
          title: 'Checkout Error',
          description: 'No checkout URL received.',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Checkout Ready',
        description: 'Redirecting to Shopify checkout...',
      });
      clearCart();
      window.location.href = cartData.cart.checkoutUrl;
    } catch (err: any) {
      toast({
        title: 'Checkout Error',
        description: err.message || 'An error occurred during checkout.',
        variant: 'destructive',
      });
    }
  }, [user, cart, clearCart, toast]);
}
