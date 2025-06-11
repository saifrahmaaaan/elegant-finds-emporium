
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { fetchShopifyProducts } from '@/services/shopify';
import { Product } from '@/types/shopify';

// Fallback placeholder products
const placeholderProducts = [
  {
    id: '1',
    name: 'Hermès Birkin 30',
    brand: 'Hermès',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless elegance in premium leather',
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80'],
    variants: [{ id: '1', title: 'Standard', price: 15000, currencyCode: 'USD' }]
  },
  {
    id: '2',
    name: 'Chanel Classic Flap',
    brand: 'Chanel',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic quilted design with chain strap',
    images: ['https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80'],
    variants: [{ id: '2', title: 'Standard', price: 8500, currencyCode: 'USD' }]
  },
  {
    id: '3',
    name: 'Louis Vuitton Neverfull',
    brand: 'Louis Vuitton',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious tote in monogram canvas',
    images: ['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80'],
    variants: [{ id: '3', title: 'Standard', price: 2100, currencyCode: 'USD' }]
  },
  {
    id: '4',
    name: 'Bottega Veneta Jodie',
    brand: 'Bottega Veneta',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    description: 'Signature intrecciato weave hobo bag',
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80'],
    variants: [{ id: '4', title: 'Standard', price: 3200, currencyCode: 'USD' }]
  }
];

export const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { 
    data: products, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['shopify-products'],
    queryFn: () => fetchShopifyProducts(12),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use Shopify products if available, otherwise fall back to placeholders
  const displayProducts = products && products.length > 0 ? products : placeholderProducts;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  if (error) {
    console.error('Error loading products:', error);
  }

  return (
    <>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-4">
              Featured <span className="luxury-text-gradient">Collections</span>
            </h2>
            <p className="text-lg text-muted-foreground font-garamond max-w-2xl mx-auto">
              {products && products.length > 0 
                ? "Handpicked luxury handbags from the world's most prestigious fashion houses"
                : "Live products loading from our Shopify store..."}
            </p>
            {isLoading && (
              <div className="mt-4">
                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-muted">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                  <span className="text-sm font-garamond">Loading products...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </>
  );
};
