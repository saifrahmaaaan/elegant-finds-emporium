// src/pages/SearchResultsPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchShopifyProductsByQuery } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const SearchResultsPage = () => {
  const [params] = useSearchParams();
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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-6">
        {term ? `Results for “${term}”` : 'Search'}
      </h1>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-500">Error loading results. Try again.</p>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
