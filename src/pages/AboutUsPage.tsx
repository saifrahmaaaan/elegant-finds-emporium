import React from 'react';
import PageLayout from '@/components/PageLayout';

const AboutUsPage: React.FC = () => {
  return (
    <PageLayout title="About Us">
      <div className="prose max-w-none">
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <img 
            src="/about-hero.jpg" 
            alt="Elegant Finds Emporium" 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <h2 className="font-garamond text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-4">
          Founded in 2025, Elegant Finds Emporium began with a simple mission: to bring together the finest selection of luxury goods in one curated destination. 
          Our passion for quality craftsmanship and timeless design drives everything we do.
        </p>
        
        <h2 className="font-garamond text-2xl font-semibold mb-4 mt-8">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Curated selection of only the finest luxury goods</li>
          <li>Exceptional customer service and personal shopping experience</li>
          <li>Commitment to authenticity and quality</li>
          <li>Sustainable and responsible luxury</li>
        </ul>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Visit Us</h2>
          <p className="mb-2">123 Luxury Lane</p>
          <p className="mb-2">New York, NY 10001</p>
          <p>Open Monday - Saturday: 10am - 7pm</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutUsPage;
