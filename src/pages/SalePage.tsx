import React from 'react';
import PageLayout from '@/components/PageLayout';

const SalePage: React.FC = () => {
  return (
    <PageLayout title="Sale">
      <div className="prose max-w-none">
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <img 
            src="/sale-banner.jpg" 
            alt="Sale Collection" 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <h2 className="font-garamond text-2xl font-semibold mb-4">Current Sales</h2>
        <p className="mb-6">
          Discover our curated selection of luxury items at exceptional prices. Limited quantities available.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">
            All sales are final. No returns or exchanges on sale items.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SalePage;
