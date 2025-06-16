import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/PageLayout';
import { Trash2, Plus, Edit, CreditCard } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import type { PaymentMethod } from '@/services/walletService';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const {
    methods: paymentMethods,
    loading,
    error,
    create,
    edit,
    remove,
    setDefault,
    refresh
  } = useWallet();

  const [formData, setFormData] = useState<{ cardNumber: string; cardholder_name: string; exp_month: string; exp_year: string; card_brand: string }>({ 
    cardNumber: '',
    cardholder_name: '',
    exp_month: '',
    exp_year: '',
    card_brand: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple card brand detection
  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s+/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'Amex';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    return 'Other';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { cardNumber, cardholder_name, exp_month, exp_year } = formData;
    const card_brand = getCardBrand(cardNumber);
    const last4 = cardNumber.replace(/\D/g, '').slice(-4);
    const method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      card_brand,
      last4,
      exp_month: Number(exp_month),
      exp_year: Number(exp_year),
      cardholder_name,
      is_default: paymentMethods.length === 0, // First card is default
    };
    if (editingId) {
      await edit(editingId, method);
    } else {
      await create(method);
    }
    setIsAdding(false);
    setEditingId(null);
    setFormData({ cardNumber: '', cardholder_name: '', exp_month: '', exp_year: '', card_brand: '' });
  };

  const handleEdit = (pm: PaymentMethod) => {
    setEditingId(pm.id!);
    setFormData({
      cardNumber: '', // Never show full card number for security
      cardholder_name: pm.cardholder_name,
      exp_month: pm.exp_month.toString().padStart(2, '0'),
      exp_year: pm.exp_year.toString(),
      card_brand: pm.card_brand,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefault(id);
  };

  const getCardIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'visa':
        return 'VISA';
      case 'mastercard':
        return 'MC';
      case 'amex':
        return 'AMEX';
      case 'discover':
        return 'DISCOVER';
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };


  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <PageLayout title="My Wallet">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-garamond">Payment Methods</h1>
          {!isAdding && (
            <Button 
              onClick={() => {
                setFormData({ 
                  cardNumber: '',
                  cardholder_name: '',
                  exp_month: '',
                  exp_year: '',
                  card_brand: '',
                });
                setEditingId(null);
                setIsAdding(true);
              }}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          )}
        </div>

        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-garamond mb-4">
              {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="cardholder_name" className="block text-sm font-medium text-gray-700 mb-1">Name on Card *</label>
                <Input
                  id="cardholder_name"
                  name="cardholder_name"
                  value={formData.cardholder_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp_month" className="block text-sm font-medium text-gray-700 mb-1">Exp. Month *</label>
                  <Input
                    id="exp_month"
                    name="exp_month"
                    value={formData.exp_month}
                    onChange={handleInputChange}
                    placeholder="MM"
                    maxLength={2}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="exp_year" className="block text-sm font-medium text-gray-700 mb-1">Exp. Year *</label>
                  <Input
                    id="exp_year"
                    name="exp_year"
                    value={formData.exp_year}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    maxLength={4}
                    required
                    className="w-full"
                  />
                </div>
              </div>
            </div> 
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="border-black text-black hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                {editingId ? 'Update Card' : 'Save Card'}
              </Button>
            </div>
          </form>
        ) : null}

        <div className="space-y-4">
          {paymentMethods.length === 0 && !isAdding ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">You don't have any saved payment methods yet.</p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            paymentMethods.map(method => (
              <div 
                key={method.id} 
                className={`border rounded-lg p-6 relative ${method.is_default ? 'border-black' : 'border-gray-200'}`}
              >
                {method.is_default && (
                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center mr-3 text-xs font-medium">
                    {getCardIcon(method.card_brand)}
                  </div>
                  <div className="font-garamond">
                    {method.card_brand}
                    {' •••• ' + method.last4}
                  </div>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p>{method.cardholder_name}</p>
                  <p>Expires {`${method.exp_month.toString().padStart(2, '0')}/${method.exp_year}`}</p>
                </div>
                <div className="flex flex-col md:flex-row justify-end md:space-x-3 space-y-2 md:space-y-0 mt-4 w-full">
                  {!method.is_default && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSetDefault(method.id!)}
                      className="text-gray-600 hover:bg-transparent hover:underline w-full md:w-auto"
                    >
                      Set as default
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(method)}
                    className="text-gray-600 hover:bg-transparent hover:underline"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(method.id!)}
                    className="text-red-600 hover:bg-transparent hover:underline"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-garamond mb-4">Security</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Your payment information is encrypted and stored securely. We don't store your CVV number.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure SSL Encryption
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default WalletPage;
