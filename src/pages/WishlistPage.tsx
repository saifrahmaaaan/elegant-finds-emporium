import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ProductCard';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

import { ProductDetailModal } from '@/components/ProductDetailModal';

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Batch fetch product details for all wishlist items
  const {
    data: products = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['wishlist-products', wishlist.map(item => item.productId)],
    queryFn: async () => {
      // Import fetchShopifyProductsByIds from services/shopify
      const { fetchShopifyProductsByIds } = await import('@/services/shopify');
      return wishlist.length > 0 ? fetchShopifyProductsByIds(wishlist.map(item => item.productId)) : [];
    },
    enabled: wishlist.length > 0,
    staleTime: 5 * 60 * 1000,
  });

    return (
    <>
      <Header />
      <main className="py-16 min-h-[60vh] px-4 md:px-12">
        <h1 className="font-garamond text-3xl mb-8 text-center">My Wishlist</h1>
        {!user ? (
          <div className="text-center">
            <p className="font-garamond text-lg mb-4">Sign in to view your wishlist.</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <p className="font-garamond text-lg mb-4">No products available in your wishlist.</p>
            <Button asChild>
              <Link to="/collections">Browse Collections</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {isLoading ? (
              <div className="text-center py-8">Loading wishlist...</div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">Failed to load wishlist products.</div>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => { setSelectedProduct(product); setDetailModalOpen(true); }} />
              ))
            )}
          </div>
        )}
        <ProductDetailModal
          product={selectedProduct}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      </main>
      <Footer />
    </>
  );
}

export default WishlistPage;
