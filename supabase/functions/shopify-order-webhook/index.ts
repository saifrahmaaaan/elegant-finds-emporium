import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let order;
  try {
    order = await req.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Extract customer's email and Shopify order ID
  const user_email = order.email || (order.customer && order.customer.email);
  const shopify_order_id = String(order.id);
  if (!user_email || !shopify_order_id) {
    return new Response('Missing user_email or order_id', { status: 400 });
  }

  // Insert order
  const { error } = await supabase.from('user_orders').insert({
    user_email,
    shopify_order_id,
    order_data: order,
  });
  if (error) {
    return new Response('DB error: ' + error.message, { status: 500 });
  }

  return new Response('OK', { status: 200 });
});
