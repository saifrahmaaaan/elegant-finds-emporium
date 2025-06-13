import { useEffect, useState } from 'react';
import { fetchShopifyCollections } from '@/services/shopify';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log('Starting collections fetch...');
        const data = await fetchShopifyCollections();
        console.log('Collections API response:', data);
        
        if (!data || data.length === 0) {
          console.warn('No collections found in response');
          setError('No collections found. Please check your Shopify setup.');
        } else {
          setCollections(data);
        }
      } catch (error) {
        console.error('Failed to load collections:', error);
        setError('Failed to load collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  return (
    <>
      <Header />
      <div className="container py-8">
        <h1 className="text-3xl font-garamond mb-8">Collections</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error} 
          <div className="mt-2 text-sm">
            (Check browser console for detailed error logs)
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 w-3/4"></div>
                <div className="h-4 bg-gray-200 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div key={collection.id} className="border rounded-xl overflow-hidden group bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img 
                  src={collection.image?.url || '/placeholder.jpg'} 
                  alt={collection.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-garamond text-xl mb-2">{collection.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {collection.productsCount} items
                  </span>
                  <Link 
                    to={`/collections/${collection.handle}`}
                    className="bg-black text-white px-4 py-2 rounded font-garamond text-sm hover:bg-neutral-900 transition-colors"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show message if no collections found */}
      {!loading && collections.length === 0 && !error && (
        <div className="text-gray-600 text-center py-12">
          No collections available. 
          <br />
          <span className="text-sm">(Create collections in your Shopify admin)</span>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
};

export default CollectionsPage;
