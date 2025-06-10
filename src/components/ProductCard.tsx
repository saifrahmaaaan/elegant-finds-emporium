
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/shopify';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    // Use the variant currency if available, otherwise default to USD
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
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <p className="text-sm text-accent font-garamond font-medium">{product.brand}</p>
          <h3 className="font-playfair font-semibold text-lg text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground font-garamond mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-playfair font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.variants.length > 1 && (
            <span className="text-xs text-muted-foreground font-garamond">
              {product.variants.length} options
            </span>
          )}
        </div>
        
        <Button 
          className="w-full luxury-gold-gradient text-black hover:opacity-90 transition-opacity font-garamond"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
