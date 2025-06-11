import { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        // Fetch all products (or you can filter by date/tag in your Shopify API for real use)
        const data = await fetchShopifyProducts(12);
        // Optionally, filter for new products here if needed
        setProducts(data);
      } catch (error) {
        console.error('Failed to load new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNewArrivals();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-8">New Arrivals</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No new arrivals right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivalsPage;
