import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  shopify_order_id: string;
  order_data: any;
  created_at: string;
}

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('user_orders')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [user]);

  return (
    <PageLayout title="My Orders">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="font-garamond text-2xl mb-6">Order History</h1>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-500">No orders found.</div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-6 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">Order #{order.shopify_order_id}</div>
                  <div className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString()}</div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> {order.order_data.financial_status || order.order_data.financialStatus || 'N/A'}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Shipping Address:</span>
                  <div className="ml-2 text-sm text-gray-700">
                    {order.order_data.shipping_address ? (
                      <>
                        {order.order_data.shipping_address.name}<br />
                        {order.order_data.shipping_address.address1}<br />
                        {order.order_data.shipping_address.city}, {order.order_data.shipping_address.province_code} {order.order_data.shipping_address.zip}<br />
                        {order.order_data.shipping_address.country}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-2 list-disc text-sm text-gray-700">
                    {(order.order_data.line_items || order.order_data.lineItems || []).map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.title} x {item.quantity} ({item.price} {item.currency || ''})
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Total:</span> {order.order_data.total_price || order.order_data.totalPrice || 'N/A'} {order.order_data.currency || ''}
                </div>
                <a
                  href={order.order_data.order_status_url || order.order_data.statusUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="mt-2">View Order on Shopify</Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyOrdersPage;
