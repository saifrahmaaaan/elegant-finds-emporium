import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/shopify';

const CollectionDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['collection', handle],
    queryFn: () => handle ? fetchCollectionProducts(handle) : [],
    enabled: !!handle
  });

  const handleProductClick = (product: Product) => {
    console.log('🖱️ [handleProductClick] Selected product:', product.id, product.name);
    setSelectedProduct(product);
  };

  console.log('🔵 [CollectionDetailPage] Render state:', {
    isLoading,
    error: error?.message,
    productsCount: products?.length || 0,
    hasHandle: !!handle
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-playfair mb-8">
          {handle ? handle.replace(/-/g, ' ') : 'Collection'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-playfair mb-8">
          {handle ? handle.replace(/-/g, ' ') : 'Collection'}
        </h1>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">Error loading products</p>
          <p className="text-red-500 text-sm mt-1">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-playfair mb-8">
          {handle ? handle.replace(/-/g, ' ') : 'Collection'}
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No products found in this collection.</p>
          <p className="text-sm text-gray-500">Please check back later or browse our other collections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-8">
        {handle ? handle.replace(/-/g, ' ') : 'Collection'}
      </h1>
      <div className="mb-4 text-sm text-gray-500">
        Showing {products.length} {products.length === 1 ? 'product' : 'products'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
};

export default CollectionDetailPage;
