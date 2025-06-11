import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from '@/types/shopify';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const product: Product | undefined = location.state?.product;

  if (!product) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-playfair">Product not found</h1>
        <Button 
          className="mt-4"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const variant = product.variants[0];
    addToCart({
      productId: product.id,
      variantId: variant.id,
      productTitle: product.name,
      variantTitle: variant.title,
      price: variant.price,
      currencyCode: variant.currencyCode,
      image: product.image,
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} variant ${index + 1}`}
                className="h-24 object-cover cursor-pointer border rounded"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-playfair">{product.name}</h1>
          <p className="text-2xl font-garamond text-accent">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.variants[0]?.currencyCode || 'USD',
            }).format(product.price)}
          </p>

          {product.variants.length > 1 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Options</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant="outline"
                    className="capitalize"
                  >
                    {variant.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full luxury-gold-gradient text-black"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>

          <div className="space-y-4">
            <h3 className="text-xl font-playfair">Product Details</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
