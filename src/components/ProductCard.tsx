import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import WishlistButton from './WishlistButton';

// Updated interface to handle both product structures
interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  currencyCode?: string;
  variants: {
    id: string;
    title: string;
    price: number;
    currencyCode: string;
  }[];
  // Fields from Shopify nodes query
  featuredImage?: {
    url: string;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Clean product ID (remove "gid://shopify/Product/" prefix if present)
  const cleanProductId = product.id.replace('gid://shopify/Product/', '');
  
  // Handle both product structures
  const mainImage = product.image || product.featuredImage?.url || '';
  const price = product.price || 
               Number(product.variants?.edges?.[0]?.node?.price?.amount) || 0;
  const currencyCode = product.currencyCode || 
                      product.variants?.edges?.[0]?.node?.price?.currencyCode || 'USD';
  const variantCount = product.variants?.length || 
                      product.variants?.edges?.length || 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Use first available variant
    const variant = product.variants?.[0] || product.variants?.edges?.[0]?.node;
    
    if (!variant) {
      toast({
        title: 'Error',
        description: 'No variants available for this product',
        variant: 'destructive'
      });
      return;
    }

    addToCart({
      productId: cleanProductId,
      variantId: variant.id.replace('gid://shopify/ProductVariant/', ''),
      productTitle: product.name,
      variantTitle: variant.title,
      price: variant.price || Number(variant.price?.amount),
      currencyCode: variant.currencyCode || variant.price?.currencyCode,
      image: mainImage,
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
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={cleanProductId} />
        </div>

        <div className="relative overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-3">
            <h3 className="font-playfair font-semibold text-lg text-foreground line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground font-garamond mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-playfair font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {variantCount > 1 && (
              <span className="text-xs text-muted-foreground font-garamond">
                {variantCount} options
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 luxury-gold-gradient text-black hover:opacity-90 transition-opacity font-garamond"
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
              className="px-3"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
