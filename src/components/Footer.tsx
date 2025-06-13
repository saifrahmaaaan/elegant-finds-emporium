import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-garamond font-bold text-2xl">EF</span>
            </div>
            <p className="text-gray-600">Curated luxury finds for the discerning shopper</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-garamond font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/designers" className="text-gray-600 hover:text-gray-900">Designers</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-600 hover:text-gray-900">New Arrivals</Link></li>
              <li><Link to="/sale" className="text-gray-600 hover:text-gray-900">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-garamond font-semibold text-lg mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-gray-900">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-gray-900">Shipping Info</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-garamond font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600" aria-label="Pinterest">
                {/* Pinterest SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.7 16.4c.3-1.6.6-3.1.8-4.5-.5-.9-.2-2.2.3-2.7.7-.7 1.8-.5 2.1.4.3.8-.2 2.1-.6 2.8-.3.5-.4 1-.4 1.6 0 .5.3 1 .8 1 .7 0 1.2-.7 1.2-1.7 0-1.3-.9-2.1-2.2-2.1-1.5 0-2.5 1.1-2.5 2.6 0 .7.4 1.2 1.1 1.2.5 0 .9-.3.9-.8 0-.4-.3-.8-.7-.8-.2 0-.4.2-.4.4 0 .3.2.7.6.7.2 0 .4-.2.4-.4 0-.2-.2-.4-.4-.4-.1 0-.2.1-.2.2 0 .2.1.3.3.3.1 0 .2-.1.2-.2 0-.1-.1-.2-.2-.2-.1 0-.1.1-.1.1 0 .1.1.1.1.1" />
                </svg>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600" aria-label="WhatsApp">
                {/* WhatsApp SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16.7 15.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.2-.7.2-.2.3-.3.5-.5.2-.2.2-.4.3-.6.1-.2 0-.4-.1-.6-.2-.2-.6-1.5-.8-2.1-.2-.6-.4-.5-.7-.5-.2 0-.4 0-.6.2-.2.2-.8.7-.8 1.7 0 1 .8 2.1 1 2.3.2.2 1.6 2.5 3.9 3.3.5.2.9.3 1.2.2.4-.1 1.2-.5 1.3-1 .1-.4.1-.8-.1-1z" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-garamond font-semibold text-lg mb-2">Newsletter Signup</h3>
            <p className="text-gray-600 text-sm mb-4">Subscribe for exclusive updates and early access to sales.</p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} EF. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { supabase } from '@/integrations/supabase/client';
// Newsletter signup form component
const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const { error } = await supabase.from('newsletter_signups').insert([{ email }]);
      if (error) {
        setStatus('error');
        setMessage('Failed to subscribe. Please try again later.');
      } else {
        setStatus('success');
        setMessage('Thank you for subscribing!');
        setEmail('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-r hover:bg-gray-800 transition-colors"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'success' && (
        <span className="ml-4 text-green-600 text-sm">{message}</span>
      )}
      {status === 'error' && (
        <span className="ml-4 text-red-600 text-sm">{message}</span>
      )}
    </form>
  );
};

export default Footer;
