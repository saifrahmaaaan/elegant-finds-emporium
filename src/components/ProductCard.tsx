import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Heart } from './Heart';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/shopify';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    const currencyCode = product.variants.length > 0 
      ? product.variants[0].currencyCode 
      : 'USD';
      
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.variants?.[0]?.id) {
      toast({
        title: 'Error',
        description: 'Product variant not available',
        variant: 'destructive'
      });
      return;
    }

    addToCart({
      productId: product.id,
      variantId: product.variants[0].id, // Use full variant ID
      productTitle: product.name,
      variantTitle: product.variants[0].title,
      price: product.variants[0].price,
      currencyCode: product.variants[0].currencyCode,
      image: product.image,
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card 
      className="group overflow-hidden border-border hover-gold-glow transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {user && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="absolute top-3 right-3 z-10 bg-white/80 rounded-full p-1 hover:bg-white transition-colors shadow"
                onClick={e => {
                  e.stopPropagation();
                  isInWishlist(product.id)
                    ? removeFromWishlist(product.id)
                    : addToWishlist({ productId: product.id });
                }}
                aria-label={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart filled={isInWishlist(product.id)} className={isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-garamond font-semibold text-lg text-foreground line-clamp-2">
            {product.name}
          </h3>
          
        </div>
        
        
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-black text-white hover:bg-neutral-900 transition-colors font-garamond"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            View Details
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            className="px-3 flex items-center justify-center"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
