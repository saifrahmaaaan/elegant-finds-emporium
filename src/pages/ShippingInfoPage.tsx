import React from 'react';
import PageLayout from '@/components/PageLayout';

const ShippingInfoPage: React.FC = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: 'Free',
      deliveryTime: '3-5 business days',
      description: 'Order processed within 1-2 business days.'
    },
    {
      name: 'Express Shipping',
      price: '$15.00',
      deliveryTime: '1-2 business days',
      description: 'Order processed same day if placed before 2pm EST.'
    },
    {
      name: 'Overnight Shipping',
      price: '$25.00',
      deliveryTime: 'Next business day',
      description: 'Order by 12pm EST for next business day delivery.'
    }
  ];

  return (
    <PageLayout title="Shipping Information">
      <div className="prose max-w-none">
        <div className="mb-12">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Shipping Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="border border-gray-200 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{option.name}</h3>
                <p className="text-2xl font-light mb-2">{option.price}</p>
                <p className="text-gray-600 mb-2">{option.deliveryTime}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Shipping Destinations</h2>
          <p className="mb-4">
            We currently ship to all 50 U.S. states and international destinations. International orders may be subject to customs fees, import duties, and taxes, which are the responsibility of the recipient.
          </p>
          <p>
            For international shipping rates and delivery times, please proceed to checkout or contact our customer service team.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Order Processing</h2>
          <p className="mb-4">
            Most orders are processed within 1-2 business days. You will receive a shipping confirmation email with tracking information once your order has shipped.
          </p>
          <p>
            Please note that processing times may be extended during holidays and promotional periods.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4">
            If you have any questions about shipping or need assistance with your order, please contact our customer service team:
          </p>
          <ul className="space-y-1">
            <li>Email: shipping@elegantfinds.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Hours: Monday - Friday, 9am - 5pm EST</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default ShippingInfoPage;
