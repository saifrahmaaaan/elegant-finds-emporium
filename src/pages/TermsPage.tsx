import React from 'react';
import PageLayout from '@/components/PageLayout';

const TermsPage: React.FC = () => (
  <PageLayout title="Terms of Service">
    <div className="prose max-w-none">
      <h2 className="font-garamond text-xl font-semibold mb-4">Terms of Service</h2>
      <p>
        By accessing or using our website, you agree to be bound by these terms. Please read them carefully.
      </p>
      <h3 className="font-semibold mt-6 mb-2">Use of Site</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>You must be at least 18 years old to purchase from us.</li>
        <li>All content is for personal, non-commercial use unless otherwise stated.</li>
      </ul>
      <h3 className="font-semibold mt-6 mb-2">Orders & Payment</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>All sales are subject to product availability and confirmation of payment.</li>
        <li>We reserve the right to cancel orders at our discretion.</li>
      </ul>
      <h3 className="font-semibold mt-6 mb-2">Intellectual Property</h3>
      <p>
        All content, trademarks, and images are property of Elegant Finds Emporium or its licensors.
      </p>
      <h3 className="font-semibold mt-6 mb-2">Contact</h3>
      <p>
        For questions about these terms, email us at legal@elegantfinds.com.
      </p>
    </div>
  </PageLayout>
);

export default TermsPage;
