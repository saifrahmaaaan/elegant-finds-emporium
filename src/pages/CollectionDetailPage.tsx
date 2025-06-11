import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCollectionProducts } from '@/services/shopify';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionDetailPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await fetchCollectionProducts(handle || '');
      
      // Add null checks for critical fields
      const transformedProducts = data
        .filter(shopifyProduct => 
          shopifyProduct?.id &&
          shopifyProduct?.handle &&
          shopifyProduct?.variants?.edges?.length > 0
        )
        .map((shopifyProduct: any) => ({
          id: shopifyProduct.id?.replace('gid://shopify/Product/', '') || 'invalid-id',
          handle: shopifyProduct.handle || 'no-handle',
          name: shopifyProduct.title,
          description: shopifyProduct.description || '',
          image: shopifyProduct.featuredImage?.url || '/placeholder-product.jpg',
          price: shopifyProduct.variants.edges[0].node.price.amount,
          variants: shopifyProduct.variants.edges.map((v: any) => ({
            id: v.node.id,
            title: v.node.title || 'Standard',
            price: v.node.price.amount,
            currencyCode: v.node.price.currencyCode
          }))
        }));

      setProducts(transformedProducts);
      setError(transformedProducts.length === 0 ? 'No products found' : '');
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Collection error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (handle) loadProducts();
}, [handle]);


  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-8">{handle?.replace(/-/g, ' ')}</h1>
      
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found in this collection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={() => navigate(`/products/${product.handle}`, { state: { product } })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetailPage;
