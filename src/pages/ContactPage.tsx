import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send form data to Supabase
      const { error } = await supabase.from('contact_messages').insert([
        { name: formData.name, email: formData.email, subject: formData.subject, message: formData.message }
      ]);
      if (error) {
        setSubmitStatus({
          success: false,
          message: 'There was an error sending your message. Please try again later.'
        });
      } else {
        setSubmitStatus({
          success: true,
          message: 'Your message has been sent successfully! We\'ll get back to you soon.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Contact Us">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-garamond text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="mb-6">
            We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, please fill out the form or use the contact information below.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <a href="mailto:info@elegantfinds.com" className="text-gray-600 hover:text-gray-900">info@elegantfinds.com</a>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <a href="tel:+15551234567" className="text-gray-600 hover:text-gray-900">(555) 123-4567</a>
            </div>
            <div>
              <h3 className="font-medium">Address</h3>
              <p className="text-gray-600">123 Luxury Lane<br />New York, NY 10001</p>
            </div>
            <div>
              <h3 className="font-medium">Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9am - 6pm EST<br />Saturday: 10am - 5pm EST<br />Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitStatus && (
              <div className={`p-4 rounded ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-black focus:border-black"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-black focus:border-black"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-black focus:border-black"
              >
                <option value="">Select a subject</option>
                <option value="Order Inquiry">Order Inquiry</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Product Questions">Product Questions</option>
                <option value="Wholesale Inquiries">Wholesale Inquiries</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-black focus:border-black"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default ContactPage;
