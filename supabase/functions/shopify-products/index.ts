
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, variables } = await req.json()
    
    const SHOPIFY_DOMAIN = Deno.env.get('SHOPIFY_DOMAIN')
    const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get('SHOPIFY_STOREFRONT_TOKEN')

    console.log('Environment check:', {
      hasDomain: !!SHOPIFY_DOMAIN,
      hasToken: !!SHOPIFY_STOREFRONT_TOKEN,
      domain: SHOPIFY_DOMAIN
    })

    if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      throw new Error('Missing Shopify configuration. Please ensure SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_TOKEN are set in environment variables.')
    }

    // Use the correct Storefront API endpoint (2024-04 version)
    const shopifyUrl = `https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`

    console.log('Making request to:', shopifyUrl)
    console.log('Query:', query)
    console.log('Variables:', variables)

    const response = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    console.log('Shopify response status:', response.status)
    console.log('Shopify response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify API error response:', errorText)
      throw new Error(`Shopify API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Shopify response data:', JSON.stringify(data, null, 2))

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
