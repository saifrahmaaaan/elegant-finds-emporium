
export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: number;
  currencyCode: string;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
}
