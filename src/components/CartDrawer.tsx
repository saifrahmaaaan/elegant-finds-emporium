import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, Bug, TestTube } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, toggleCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const { toast } = useToast();

  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const showDebugInfo = () => {
    const lineItems = cart.items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
    
    setDebugInfo({
      lineItems,
      totalItems: cart.itemCount,
      cartTotal: cart.total,
      timestamp: new Date().toISOString()
    });
    
    console.log('Debug Info - Cart Line Items:', lineItems);
    console.log('Debug Info - Full Cart State:', cart);
  };

  const testApiConnection = async () => {
    setIsTesting(true);
    setApiTestResult(null);
    
    try {
      console.log('Testing Shopify API connection...');
      
      const testQuery = `
        query testConnection {
          shop {
            name
            primaryDomain {
              url
            }
          }
        }
      `;

      const { data, error } = await supabase.functions.invoke('shopify-products', {
        body: {
          query: testQuery,
          variables: {}
        }
      });

      console.log('API Test Response:', data);
      console.log('API Test Error:', error);

      setApiTestResult({
        success: !error && data && !data.errors,
        data: data,
        error: error,
        timestamp: new Date().toISOString()
      });

      if (error) {
        toast({
          title: 'API Test Failed',
          description: `Connection error: ${error.message}`,
          variant: 'destructive',
        });
      } else if (data && data.errors) {
        toast({
          title: 'GraphQL Errors',
          description: `GraphQL errors found: ${data.errors.map((e: any) => e.message).join(', ')}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'API Test Successful',
          description: 'Shopify API connection is working correctly.',
        });
      }
    } catch (error: any) {
      console.error('API test error:', error);
      setApiTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'API Test Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      // Prepare line items with validation
      const lineItems = cart.items
        .filter(item => item.variantId && item.quantity > 0) // Only valid items
        .map(item => ({
          merchandiseId: item.variantId, // Changed from variantId to merchandiseId
          quantity: item.quantity,
        }));

      if (lineItems.length === 0) {
        throw new Error('No valid items found in cart');
      }

      console.log('Sending checkout request with line items:', lineItems);

      // START OF CRITICAL CHANGES (LINES 192-238)
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

      const { data, error } = await supabase.functions.invoke('shopify-products', {
        body: {
          query: cartMutation,
          variables: {
            cartInput: {
              lines: lineItems,
            },
          },
        },
      });
      // END OF CRITICAL CHANGES

      console.log('Shopify API Response:', data);
      console.log('Supabase Function Error:', error);

      // Handle Supabase function errors
      if (error) {
        console.error('Supabase function error:', error);
        setCheckoutError(`Function Error: ${error.message}`);
        throw new Error(`Failed to create checkout: ${error.message}`);
      }

      // Handle missing or invalid response structure
      if (!data) {
        console.error('No response data received');
        setCheckoutError('No response data received from API');
        throw new Error('No response data received from Shopify API');
      }

      // Handle GraphQL errors
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        const errorMessages = data.errors.map((err: any) => err.message).join(', ');
        setCheckoutError(`GraphQL Errors: ${errorMessages}`);
        throw new Error(`GraphQL errors: ${errorMessages}`);
      }

      // Handle missing data structure
      if (!data.data) {
        console.error('Invalid response structure - missing data field:', data);
        setCheckoutError('Invalid response structure from Shopify API');
        throw new Error('Invalid response structure from Shopify API');
      }

      const cartData = data.data.cartCreate;
      
      // Check for Shopify-specific cart errors
      if (cartData.userErrors && cartData.userErrors.length > 0) {
        const errorMessages = cartData.userErrors
          .map((err: any) => `${err.field ? err.field + ': ' : ''}${err.message}`)
          .join(', ');
        
        console.error('Shopify cart errors:', cartData.userErrors);
        setCheckoutError(`Cart Errors: ${errorMessages}`);
        throw new Error(errorMessages);
      }

      // Validate cart creation
      if (!cartData.cart || !cartData.cart.checkoutUrl) {
        console.error('No checkout URL received:', cartData);
        setCheckoutError('No checkout URL received from Shopify');
        throw new Error('No checkout URL received from Shopify');
      }

      console.log('Cart created successfully:', cartData.cart);
      
      // Show success message
      toast({
        title: 'Checkout Ready',
        description: 'Redirecting to Shopify checkout...',
      });

      // Clear cart before redirect
      clearCart();
      
      // Redirect to Shopify checkout
      window.location.href = cartData.cart.checkoutUrl;
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during checkout';
      
      if (!checkoutError) {
        setCheckoutError(errorMessage);
      }
      
      toast({
        title: 'Checkout Error',
        description: errorMessage,
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
                          <p className="text-xs text-muted-foreground font-mono">
                            ID: {item.variantId}
                          </p>
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

              {checkoutError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="text-sm whitespace-pre-wrap">
                    <strong>Checkout Error:</strong><br />
                    {checkoutError}
                  </AlertDescription>
                </Alert>
              )}

              {debugInfo && (
                <Alert className="mb-4">
                  <AlertDescription className="text-xs font-mono whitespace-pre-wrap">
                    <strong>Debug Info:</strong><br />
                    Line Items: {JSON.stringify(debugInfo.lineItems, null, 2)}<br />
                    Total: {debugInfo.totalItems} items, ${debugInfo.cartTotal}<br />
                    Time: {debugInfo.timestamp}
                  </AlertDescription>
                </Alert>
              )}

              {apiTestResult && (
                <Alert className="mb-4">
                  <AlertDescription className="text-xs font-mono whitespace-pre-wrap">
                    <strong>API Test Result:</strong><br />
                    Success: {apiTestResult.success ? 'Yes' : 'No'}<br />
                    {apiTestResult.data && (
                      <>Data: {JSON.stringify(apiTestResult.data, null, 2)}<br /></>
                    )}
                    {apiTestResult.error && (
                      <>Error: {JSON.stringify(apiTestResult.error, null, 2)}<br /></>
                    )}
                    Time: {apiTestResult.timestamp}
                  </AlertDescription>
                </Alert>
              )}

              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-playfair font-bold text-lg">Total:</span>
                  <span className="font-playfair font-bold text-lg">
                    {formatPrice(cart.total, cart.items[0]?.currencyCode)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testApiConnection}
                    disabled={isTesting}
                    className="w-full"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTesting ? 'Testing...' : 'Test API'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showDebugInfo}
                    className="w-full"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Debug Info
                  </Button>
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
