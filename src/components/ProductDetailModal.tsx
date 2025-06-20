
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Heart } from './Heart';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Product } from '@/types/shopify';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailModal = ({ product, open, onOpenChange }: ProductDetailModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product || !product.variants?.[selectedVariant]) {
      console.error('Cannot add to cart: Missing product or variant data');
      return;
    }
    
    const variant = product.variants[selectedVariant];
    const productName = product.name || 'Product';
    const variantName = variant?.title || 'Standard';
    const productImage = product.images?.[0] || product.image || '/placeholder-product.jpg';
    let price: number = 0;
if (typeof variant?.price === 'number') {
  price = variant.price;
} else if (variant?.price && typeof variant.price === 'object' && 'amount' in variant.price) {
  price = parseFloat((variant.price as { amount: string }).amount || '0');
}

    // Use the correct cart item structure expected by the CartContext
    addToCart({
      productId: product.id,
      variantId: variant.id,
      productTitle: productName,
      variantTitle: variantName,
      price: price,
      currencyCode: variant.currencyCode || 'USD',
      image: productImage
    });

    toast({
      title: 'Added to cart',
      description: `${productName} (${variantName}) has been added to your cart.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-garamond text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product?.name || 'Product image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name || 'Product image'}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Wishlist Heart Icon */}
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
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-accent' 
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-accent font-garamond font-medium">{product.brand}</p>
              <h2 className="font-garamond font-bold text-2xl text-foreground mb-2">
                {product.name}
              </h2>
              <p className="text-muted-foreground font-garamond leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {(product.variants || []).length > 1 && (
              <div className="space-y-3">
                <h3 className="font-garamond font-semibold text-lg">Options</h3>
                <div className="space-y-2">
                  {(product.variants || []).map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedVariant === index
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-garamond">{variant.title}</span>
                        <span className="font-garamond font-semibold">
                          {formatPrice(variant.price, variant.currencyCode)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-4">
              <div className="text-3xl font-garamond font-bold text-foreground">
                {product.variants.length > 0 
                  ? formatPrice(
                      product.variants[selectedVariant].price,
                      product.variants[selectedVariant].currencyCode
                    )
                  : formatPrice(product.price)
                }
              </div>
            </div>
          </div>
        </div>
        {/* Add to Cart button always at the bottom */}
        <div className="pt-6">
          <Button 
            className="w-full bg-black text-white hover:bg-neutral-900 transition-colors font-garamond py-3"
            size="lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
