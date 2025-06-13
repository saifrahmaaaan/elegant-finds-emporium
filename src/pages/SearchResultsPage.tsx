// src/pages/SearchResultsPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchShopifyProductsByQuery } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/shopify';

import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const term = params.get('q')?.trim() ?? '';

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search', term],
    queryFn: () => fetchShopifyProductsByQuery(term, 20),
    enabled: term.length > 0, // don’t hit API if empty
    staleTime: 60 * 1000,
  });

  const handleProductClick = (product: Product) => {
    console.log('🖱️ [handleProductClick] Selected product:', product.id, product.name);
    setSelectedProduct(product);
  };

  return (
    <>
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-garamond mb-6">
        {term ? `Results for "${term}"` : 'Search'}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-red-500">Error loading results. Please try again.</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
      </div>
      <Footer />
    </>
  );
};

export default SearchResultsPage;
