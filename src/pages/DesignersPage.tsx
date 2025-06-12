import { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to group products by vendor/designer
const groupByDesigner = (products: any[]): Record<string, any[]> => {
  const groups = {};
  products.forEach(product => {
    const designer = product.brand || 'Unknown Designer';
    if (!groups[designer]) groups[designer] = [];
    groups[designer].push(product);
  });
  return groups;
};

const DesignersPage = () => {
  const [designerGroups, setDesignerGroups] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const loadDesigners = async () => {
      try {
        const data = await fetchShopifyProducts(50);
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
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-8">Designers</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : Object.keys(designerGroups).length === 0 ? (
        <p className="text-gray-600">No designers found.</p>
      ) : (
        Object.entries(designerGroups).map(([designer, products]) => (
          <div key={designer} className="mb-10">
            <h2 className="text-2xl font-garamond mb-4">{designer}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
};

export default DesignersPage;
