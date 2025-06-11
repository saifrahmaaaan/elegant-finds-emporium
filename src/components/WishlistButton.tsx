'use client'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export default function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Ensure we store clean product IDs with Shopify prefix
  const cleanProductId = productId.startsWith('gid://shopify/Product/') 
    ? productId 
    : `gid://shopify/Product/${productId}`;

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { count } = await supabase
        .from('wishlist')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('product_id', cleanProductId)

      setIsWishlisted(!!count)
    }
    checkWishlist()
  }, [cleanProductId])

  const handleWishlist = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save items to your wishlist',
      })
      return
    }

    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', cleanProductId)
      } else {
        await supabase
          .from('wishlist')
          .insert([{ 
            user_id: user.id, 
            product_id: cleanProductId 
          }])
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleWishlist}
      disabled={loading}
      className="absolute top-2 right-2 hover:scale-110 transition-transform"
    >
      <Heart 
        size={20} 
        fill={isWishlisted ? 'currentColor' : 'transparent'}
        className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
      />
    </button>
  )
}
