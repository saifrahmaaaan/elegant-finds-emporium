
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, toggleCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    setIsCheckingOut(true);
    
    try {
      const lineItems = cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const checkoutMutation = `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
          checkoutCreate(input: $input) {
            checkout {
              id
              webUrl
            }
            checkoutUserErrors {
              field
              message
            }
          }
        }
      `;

      const { data, error } = await supabase.functions.invoke('shopify-products', {
        body: {
          query: checkoutMutation,
          variables: {
            input: {
              lineItems: lineItems,
            },
          },
        },
      });

      if (error) {
        throw new Error('Failed to create checkout');
      }

      const checkoutData = data.data.checkoutCreate;
      
      if (checkoutData.checkoutUserErrors.length > 0) {
        throw new Error(checkoutData.checkoutUserErrors[0].message);
      }

      // Redirect to Shopify checkout
      window.location.href = checkoutData.checkout.webUrl;
      
      // Clear cart after successful checkout creation
      clearCart();
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: 'Failed to create checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={cart.isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-playfair text-2xl">
            Shopping Cart
            {cart.itemCount > 0 && (
              <span className="ml-2 text-sm font-garamond text-muted-foreground">
                ({cart.itemCount} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground font-garamond text-lg mb-4">
                  Your cart is empty
                </p>
                <Button onClick={toggleCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.productTitle}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-playfair font-semibold text-sm line-clamp-2">
                            {item.productTitle}
                          </h4>
                          {item.variantTitle !== 'Default Title' && (
                            <p className="text-xs text-muted-foreground font-garamond">
                              {item.variantTitle}
                            </p>
                          )}
                          <p className="font-playfair font-bold text-sm">
                            {formatPrice(item.price, item.currencyCode)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-garamond">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.variantId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-playfair font-bold text-lg">Total:</span>
                  <span className="font-playfair font-bold text-lg">
                    {formatPrice(cart.total, cart.items[0]?.currencyCode)}
                  </span>
                </div>
                
                <Button
                  className="w-full luxury-gold-gradient text-black hover:opacity-90 transition-opacity font-garamond py-3"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Creating Checkout...' : 'Proceed to Checkout'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
