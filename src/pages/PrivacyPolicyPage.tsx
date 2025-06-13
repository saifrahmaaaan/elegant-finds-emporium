import React from 'react';
import PageLayout from '@/components/PageLayout';

const PrivacyPolicyPage: React.FC = () => (
  <PageLayout title="Privacy Policy">
    <div className="prose max-w-none">
      <h2 className="font-garamond text-xl font-semibold mb-4">Your Privacy</h2>
      <p>
        We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website.
      </p>
      <h3 className="font-semibold mt-6 mb-2">Information We Collect</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal information you provide (name, email, address, etc.)</li>
        <li>Order and payment details</li>
        <li>Browsing data and cookies</li>
      </ul>
      <h3 className="font-semibold mt-6 mb-2">How We Use Your Information</h3>
      <ul className="list-disc pl-6 mb-4">
        <li>To fulfill orders and provide customer service</li>
        <li>To improve our website and offerings</li>
        <li>To send marketing communications (with your consent)</li>
      </ul>
      <h3 className="font-semibold mt-6 mb-2">Your Rights</h3>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time. Contact us for assistance.
      </p>
      <h3 className="font-semibold mt-6 mb-2">Contact</h3>
      <p>
        For privacy-related questions, email us at privacy@elegantfinds.com.
      </p>
    </div>
  </PageLayout>
);

export default PrivacyPolicyPage;
