import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);
      if (data) setWishlist(data.map((item) => item.product_id));
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair mb-6">Your Wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : wishlist.length === 0 ? (
        <p>No items in your wishlist</p>
      ) : (
        <ul>
          {wishlist.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
