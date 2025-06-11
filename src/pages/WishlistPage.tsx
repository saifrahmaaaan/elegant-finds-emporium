import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { fetchShopifyProductsByIds } from "@/services/shopify";

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get wishlist product IDs from Supabase
      const { data } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);

      if (!data || data.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productIds = data.map(item => item.product_id);

      // 2. Fetch full product details from Shopify
      const productsData = await fetchShopifyProductsByIds(productIds);
      setProducts(productsData);
      setLoading(false);
    };

    fetchWishlistProducts();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-6">Your Wishlist</h1>
      
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
              <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No items in your wishlist</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={{
                id: product.id.split("/").pop(), // Extract clean ID
                title: product.title,
                description: product.description,
                featuredImage: product.featuredImage?.url,
                price: product.variants?.edges[0]?.node?.price?.amount,
                currencyCode: product.variants?.edges[0]?.node?.price?.currencyCode
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
