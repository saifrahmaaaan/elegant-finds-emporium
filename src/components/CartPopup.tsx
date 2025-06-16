import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartPopupProps {
  open: boolean;
  onClose: () => void;
  onViewCart: () => void;
}

import { useCartCheckoutHandler } from './CartPopupCheckoutHandler';

export const CartPopup: React.FC<CartPopupProps> = ({ open, onClose, onViewCart }) => {
  const handleCheckout = useCartCheckoutHandler();
  const { cart } = useCart();
  if (!open) return null;
  // Outside click backdrop
  const backdrop = (
    <div
      className="fixed inset-0 z-[9999] bg-transparent"
      onClick={onClose}
      aria-label="Close Cart Popup Backdrop"
    />
  );
  if (!cart.items || cart.items.length === 0) {
    return ReactDOM.createPortal(
      <>
        {backdrop}
        <div
          className="ef-cart-popup fixed z-[10000] bg-white shadow-2xl border border-gray-200 animate-fade-in duration-150 flex flex-col items-center justify-center rounded-none w-full max-w-[calc(100vw-1rem)] mx-auto left-0 right-0 mt-4 sm:rounded-none sm:w-full sm:max-w-sm sm:mx-0 sm:top-6 sm:right-6 sm:left-auto sm:mt-0 p-4"
          style={{
            top: '1.5rem',
            overflow: 'visible',
            minWidth: 0,
          }}
          onClick={e => e.stopPropagation()}>
          <span className="font-garamond font-semibold text-lg text-black mb-2">No items in your cart yet.</span>
          <a href="/" className="mt-2 w-full">
            <Button className="w-full bg-black text-white hover:bg-gray-900">Continue Shopping</Button>
          </a>
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">×</button>
        </div>
      </>,
      document.body
    );
  }

  // Ensure parent containers do not clip popup
  document.body.style.overflow = 'visible';

  // Popup content
  const popup = (
    <div
      className="ef-cart-popup fixed z-[10000] bg-white shadow-2xl border border-gray-200 animate-fade-in duration-150 flex flex-col rounded-none w-full max-w-[calc(100vw-1rem)] mx-auto left-0 right-0 mt-4 sm:rounded-none sm:w-full sm:max-w-sm sm:mx-0 sm:top-6 sm:right-6 sm:left-auto sm:mt-0"
      style={{
        top: '1.5rem',
        overflow: 'visible',
        padding: 0,
        minWidth: 0,
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center border-b px-6 py-4 z-[100] relative bg-white">
        <span className="font-garamond font-semibold text-lg text-black">Added to Shopping Bag</span>
        <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black text-xl">×</button>
      </div>
      <div className="px-6 py-4 max-h-72 overflow-y-auto relative z-[10000]" style={{ overflow: 'auto' }}>
        {cart.items.map((item, idx) => (
          <div key={item.variantId + idx} className="grid grid-cols-[4rem,1fr] gap-3 border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
            <img
              src={item.image}
              alt={item.productTitle}
              className="w-16 h-16 object-cover rounded-lg border"
            />
            <div className="min-w-0 relative z-[10000]">
              <div className="font-garamond font-semibold text-sm truncate text-black" title={item.productTitle}>
                {item.productTitle}
              </div>
              {item.variantTitle !== 'Default Title' && (
                <div className="text-xs text-muted-foreground font-garamond truncate text-gray-600" title={item.variantTitle}>
                  {item.variantTitle}
                </div>
              )}
              <div className="mt-1 flex justify-between items-center">
                <span className="font-garamond text-xs text-gray-800">Quantity: {item.quantity}</span>
                <span className="font-garamond font-bold text-sm text-black">
                  {item.price.toLocaleString(undefined, { style: 'currency', currency: item.currencyCode })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
        <Button className="w-full bg-black text-white hover:bg-gray-900" onClick={handleCheckout}>Checkout</Button>
        <Button className="w-full border border-black bg-white text-black hover:bg-gray-100" onClick={onViewCart}>View Shopping Bag</Button>
      </div>
    </div>
  );

  // Render via portal
  return ReactDOM.createPortal(popup, document.body);
};
