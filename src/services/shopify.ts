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
              featuredImage {
                url
              }
              variants(first: 1) {
                edges {
                  node {
                    id
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
    const response = await fetchShopifyGraphQL(query, { handle: collectionHandle });
    
    // Simplified error handling
    if (!response?.collectionByHandle?.products?.edges) {
      console.error('Invalid response structure:', response);
      return [];
    }

    return response.collectionByHandle.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching collection products:', error);
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
