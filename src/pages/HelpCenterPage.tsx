import React from 'react';
import PageLayout from '@/components/PageLayout';

const HelpCenterPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay."
    },
    {
      question: "How can I return an item?",
      answer: "You can initiate a return through your account dashboard or contact our customer service for assistance. Please refer to our Returns & Exchanges policy for more details."
    },
    {
      question: "What is your shipping policy?",
      answer: "We offer standard and express shipping options. Standard delivery typically takes 3-5 business days, while express delivery takes 1-2 business days. For more information, visit our Shipping Info page."
    },
    {
      question: "How do I contact customer service?",
      answer: "You can reach our customer service team by email at support@elegantfinds.com or by phone at (555) 123-4567. Our team is available Monday through Friday, 9am to 5pm EST."
    }
  ];

  return (
    <PageLayout title="Help Center">
      <div className="prose max-w-none">
        <div className="mb-12">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="font-garamond text-2xl font-semibold mb-4">Still need help?</h2>
          <p className="mb-4">
            If you can't find the answer you're looking for, our customer service team is here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpCenterPage;
