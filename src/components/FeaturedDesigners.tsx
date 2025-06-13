import React, { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to group products by vendor/designer
const groupByDesigner = (products: any[]): Record<string, any[]> => {
  const groups: Record<string, any[]> = {};
  products.forEach(product => {
    const designer = product.brand || 'Unknown Designer';
    if (!groups[designer]) groups[designer] = [];
    groups[designer].push(product);
  });
  return groups;
};

export const FeaturedDesigners: React.FC = () => {
  const [designerGroups, setDesignerGroups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const loadDesigners = async () => {
      try {
        const data = await fetchShopifyProducts(16); // limit to 16 for homepage
        setDesignerGroups(groupByDesigner(data));
      } catch (error) {
        console.error('Failed to load designers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDesigners();
  }, []);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  // Only show up to 4 designers, each with up to 2 products
  const featured = Object.entries(designerGroups).slice(0, 4);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-playfair font-bold mb-10 text-center">Featured Designers</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[320px] w-full rounded-lg" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-gray-600 text-center">No designers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(([designer, products]) => (
              <div key={designer} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <a href="/designers" className="font-garamond text-xl font-semibold mb-4 text-center text-black hover:underline block">{designer}</a>
                <div className="flex flex-col gap-4 w-full">
                  {products.slice(0, 2).map(product => (
                    <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      </div>
    </section>
  );
};
