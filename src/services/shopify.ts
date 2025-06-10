
import { supabase } from '@/integrations/supabase/client';
import { ShopifyProductsResponse, ShopifyProduct, Product } from '@/types/shopify';

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
    // Get secrets from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await supabase.functions.invoke('shopify-products', {
      body: { 
        query: SHOPIFY_GRAPHQL_QUERY,
        variables: { first }
      }
    });

    if (response.error) {
      console.error('Shopify API error:', response.error);
      throw new Error('Failed to fetch products from Shopify');
    }

    const shopifyData: ShopifyProductsResponse = response.data;
    
    return shopifyData.data.products.edges.map(({ node }) => 
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
    image: images[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80',
    description: shopifyProduct.description,
    images,
    variants,
  };
};
