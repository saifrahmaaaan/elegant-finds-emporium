import { supabase } from '@/integrations/supabase/client';
import { ShopifyProductsResponse, ShopifyProduct, Product } from '@/types/shopify';

// Generic Shopify GraphQL fetch helper
async function fetchShopifyGraphQL(query: string, variables: any = {}) {
  try {
    const response = await supabase.functions.invoke('shopify-products', {
      body: { query, variables }
    });

    console.log('Raw Supabase response:', response);

    if (response.error) {
      throw new Error(`Supabase function error: ${response.error.message}`);
    }

    // Handle different response structures
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('Invalid Shopify response: No data received');
    }

    // Log the final response structure
    console.log('Processed Shopify response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Shopify GraphQL Error:', error);
    throw error;
  }
}

const SHOPIFY_GRAPHQL_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          vendor
          images(first: 3) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const fetchShopifyProducts = async (first: number = 12): Promise<Product[]> => {
  try {
    const shopifyData = await fetchShopifyGraphQL(SHOPIFY_GRAPHQL_QUERY, { first });
    
    if (!shopifyData?.products?.edges) {
      throw new Error('Invalid products response structure');
    }

    return shopifyData.products.edges.map(({ node }: { node: ShopifyProduct }) => 
      transformShopifyProduct(node)
    );
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
};

// Fetch a batch of products by Shopify product IDs (for wishlist)
export const fetchShopifyProductsByIds = async (ids: string[]): Promise<Product[]> => {
  try {
    console.log('Fetching products by IDs:', ids);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.log('No valid product IDs provided');
      return [];
    }

    // Clean and validate IDs
    const validIds = ids
      .map(id => {
        // Extract just the numeric ID if it's in the format 'gid://shopify/Product/1234567890'
        const match = id.match(/\/(\d+)$/);
        return match ? match[1] : id;
      })
      .filter(Boolean);

    if (validIds.length === 0) {
      console.log('No valid product IDs after cleaning');
      return [];
    }

    console.log('Cleaned product IDs:', validIds);

    // Fetch all products and filter by the requested IDs
    const allProducts = await fetchShopifyProducts(100);
    
    // Match products by ID (handling both full GID and numeric ID)
    const matchedProducts = allProducts.filter(p => {
      // Extract numeric ID from the product's GID
      const productIdMatch = p.id.match(/\/(\d+)$/);
      const productNumericId = productIdMatch ? productIdMatch[1] : p.id;
      
      return validIds.some(id => 
        id === p.id || // Match full GID
        id === productNumericId || // Match numeric ID
        p.id.endsWith(`/${id}`) // Match if ID is at the end of GID
      );
    });

    console.log(`Found ${matchedProducts.length} matching products`);
    return matchedProducts;
  } catch (error) {
    console.error('Error in fetchShopifyProductsByIds:', error);
    throw error;
  }
};

const transformShopifyProduct = (shopifyProduct: ShopifyProduct): Product => {
  const variants = shopifyProduct.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    price: parseFloat(node.price.amount),
    currencyCode: node.price.currencyCode,
  }));

  const images = shopifyProduct.images.edges.map(({ node }) => node.url);
  const lowestPrice = Math.min(...variants.map(v => v.price));

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    brand: shopifyProduct.vendor || 'Designer',
    price: lowestPrice,
    image: images[0] || '/placeholder-product.jpg',
    description: shopifyProduct.description,
    images,
    variants,
  };
};

export async function fetchShopifyCollections() {
  const query = `
    query getCollections {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetchShopifyGraphQL(query);
    
    // Add validation
    if (!response?.collections?.edges) {
      throw new Error('Invalid collections response structure');
    }

    return response.collections.edges.map((edge: any) => ({
      id: edge.node.id.replace('gid://shopify/Collection/', ''),
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      image: {
        url: edge.node.image?.url || '/placeholder-collection.jpg'
      }
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return []; // Return empty array instead of throwing
  }
}

// In shopify.ts - fetchCollectionProducts
export async function fetchCollectionProducts(collectionHandle: string) {
  const query = `
    query getCollectionProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              featuredImage {
                url
              }
              images(first: 3) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log('📡 [fetchCollectionProducts] Sending GraphQL query...');
    const response = await fetchShopifyGraphQL(query, { handle: collectionHandle });
    
    console.log('📦 [fetchCollectionProducts] Raw API response:', JSON.stringify(response, null, 2));
    
    if (!response) {
      console.error('❌ [fetchCollectionProducts] No response from API');
      return [];
    }
    
    if (!response.collectionByHandle) {
      console.error('❌ [fetchCollectionProducts] No collection found for handle:', collectionHandle);
      console.log('Available collections (if any):', Object.keys(response));
      return [];
    }
    
    if (!response.collectionByHandle.products?.edges) {
      console.error('❌ [fetchCollectionProducts] Invalid products data structure:', response.collectionByHandle);
      return [];
    }

    console.log(`📊 [fetchCollectionProducts] Found ${response.collectionByHandle.products.edges.length} products`);
    
    const products = response.collectionByHandle.products.edges.map(({ node }: { node: any }, index: number) => {
      try {
        console.log(`🔄 [fetchCollectionProducts] Processing product ${index + 1}:`, node.title);
        
        const images = node.images?.edges?.map((edge: any) => edge.node.url) || [];
        const variants = node.variants?.edges?.map(({ node: variant }: { node: any }) => ({
          id: variant.id,
          title: variant.title || 'Default',
          price: parseFloat(variant.price?.amount || '0'),
          currencyCode: variant.price?.currencyCode || 'USD'
        })) || [];

        const product = {
          id: node.id?.replace('gid://shopify/Product/', '') || `unknown-${index}`,
          name: node.title || 'Unnamed Product',
          description: node.description || 'No description available',
          brand: node.vendor || 'Designer',
          image: node.featuredImage?.url || images[0] || '/placeholder-product.jpg',
          images: images,
          price: variants[0]?.price || 0,
          variants: variants
        };
        
        if (variants.length === 0) {
          console.warn(`⚠️ [fetchCollectionProducts] No variants found for product:`, node.title);
        }
        
        console.log(`✅ [fetchCollectionProducts] Processed product:`, product.name);
        return product;
      } catch (error) {
        console.error(`❌ [fetchCollectionProducts] Error processing product ${index}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from failed processing
    
    console.log(`🎉 [fetchCollectionProducts] Successfully processed ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ [fetchCollectionProducts] Error fetching collection products:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Return empty array on error to prevent crashes
    return [];
  }
}

// Search products by text query
export const fetchShopifyProductsByQuery = async (
  queryText: string,
  first = 20
): Promise<Product[]> => {
  const term = queryText.trim();
  if (!term) return [];

  const SEARCH_QUERY = `
    query Search($term: String!, $first: Int!) {
      products(first: $first, query: $term) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            featuredImage { url }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchShopifyGraphQL(SEARCH_QUERY, {
      term,          // matches $term
      first,
    });

    const edges = data?.products?.edges ?? [];
    if (edges.length === 0) return [];

    return edges.map(({ node }: { node: ShopifyProduct & { featuredImage?: { url: string } } }) => {
      const img = node.featuredImage?.url || node.images?.edges?.[0]?.node.url || '/placeholder-product.jpg';

      const variants = node.variants.edges.map(({ node: v }) => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price.amount),
        currencyCode: v.price.currencyCode,
      }));

      const lowestPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;

      return {
        id: node.id,
        name: node.title,
        brand: node.vendor || 'Designer',
        price: lowestPrice,
        image: img,
        description: node.description,
        images: [img],
        variants,
      } as import('@/types/shopify').Product;
    });
  } catch (err) {
    console.error('Shopify search error:', err);
    return [];
  }
};
