import React from 'react';
import PageLayout from '@/components/PageLayout';

const ReturnsPage: React.FC = () => {
  return (
    <PageLayout title="Returns & Exchanges">
      <div className="prose max-w-none">
        <div className="mb-8">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Return Policy</h2>
          <p className="mb-4">
            We want you to be completely satisfied with your purchase. If for any reason you're not, we're here to help with returns and exchanges within 14 days of delivery.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Items must be in original, unused condition with all tags attached</li>
              <li>Proof of purchase is required</li>
              <li>Final sale items are not eligible for return or exchange</li>
              <li>Customer is responsible for return shipping costs</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-garamond text-2xl font-semibold mb-4">How to Return</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Log in to your account and go to Order History</li>
            <li>Select the item(s) you wish to return and follow the prompts</li>
            <li>Print the return label and packing slip</li>
            <li>Package your return securely and attach the label</li>
            <li>Drop off at your nearest shipping location</li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Refunds</h2>
          <p className="mb-4">
            Once we receive and inspect your return, we'll process your refund within 3-5 business days. Refunds will be issued to the original payment method.
          </p>
          <p>
            Please note that shipping fees are non-refundable, and return shipping costs are the responsibility of the customer.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700">
            If you have any questions about our return policy, please contact our customer service team at returns@elegantfinds.com or call (555) 123-4567.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ReturnsPage;
