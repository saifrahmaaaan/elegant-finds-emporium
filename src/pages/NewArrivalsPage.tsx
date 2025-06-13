import { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Skeleton } from '@/components/ui/skeleton';

import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const NewArrivalsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', {
      id: product.id,
      name: product.name,
      hasImages: Boolean(product.images?.length),
      hasVariants: Boolean(product.variants?.length),
      image: product.image
    });
    setSelectedProduct(product);
  };

  return (
    <>
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-garamond mb-8">New Arrivals</h1>
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

export default NewArrivalsPage;
