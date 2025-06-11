import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { fetchShopifyProductsByIds } from "@/services/shopify";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const WishlistPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your wishlist",
          });
          setLoading(false);
          return;
        }

        // 1. Get wishlist product IDs from Supabase
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", user.id);

        if (error) throw error;
        if (!data || data.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // 2. Convert to Shopify IDs
        const shopifyIds = data.map(item =>
          `gid://shopify/Product/${item.product_id}`
        );

        // 3. Fetch product details from Shopify
        const shopifyProducts = await fetchShopifyProductsByIds(shopifyIds);

        // 4. Transform to match ProductCard's expected format
        const transformedProducts = shopifyProducts
          .filter(Boolean)
          .map((product: any) => ({
            id: product.id,
            name: product.title,
            description: product.description,
            image: product.featuredImage?.url || "",
            price: Number(product.variants?.edges[0]?.node?.price?.amount) || 0,
            currencyCode: product.variants?.edges[0]?.node?.price?.currencyCode,
            variants: product.variants?.edges.map((edge: any) => ({
              id: edge.node.id,
              title: edge.node.title,
              price: Number(edge.node.price?.amount),
              currencyCode: edge.node.price?.currencyCode
            })) || []
          }));

        setProducts(transformedProducts);
      } catch (error) {
        toast({
          title: "Error loading wishlist",
          description: "Could not fetch your wishlist items",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-6">Your Wishlist</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No items in your wishlist</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {
                /* Add modal trigger if needed */
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
