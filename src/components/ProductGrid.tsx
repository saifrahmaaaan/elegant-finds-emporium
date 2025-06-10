
import { ProductCard } from '@/components/ProductCard';

const placeholderProducts = [
  {
    id: '1',
    name: 'Hermès Birkin 30',
    brand: 'Hermès',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    description: 'Timeless elegance in premium leather'
  },
  {
    id: '2',
    name: 'Chanel Classic Flap',
    brand: 'Chanel',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic quilted design with chain strap'
  },
  {
    id: '3',
    name: 'Louis Vuitton Neverfull',
    brand: 'Louis Vuitton',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious tote in monogram canvas'
  },
  {
    id: '4',
    name: 'Bottega Veneta Jodie',
    brand: 'Bottega Veneta',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    description: 'Signature intrecciato weave hobo bag'
  }
];

export const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-4">
            Featured <span className="luxury-text-gradient">Collections</span>
          </h2>
          <p className="text-lg text-muted-foreground font-garamond max-w-2xl mx-auto">
            Handpicked luxury handbags from the world's most prestigious fashion houses
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {placeholderProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
