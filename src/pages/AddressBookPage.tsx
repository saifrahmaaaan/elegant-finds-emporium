import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/PageLayout';
import { Trash2, Plus, Edit, Loader2 } from 'lucide-react';
import { useAddressBook } from '@/hooks/useAddressBook';
import { Address } from '@/services/addressService';
import { toast } from '@/hooks/use-toast';

const AddressBookPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const {
    addresses,
    loading,
    error,
    createAddress,
    editAddress,
    deleteAddress,
    setDefaultAddress,
    refresh: refreshAddresses
  } = useAddressBook();

  const [formData, setFormData] = useState<Omit<Address, 'id' | 'user_id' | 'is_default' | 'created_at' | 'updated_at'>>({ 
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load addresses',
        variant: 'destructive',
      });
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing address
        await editAddress(editingId, {
          ...formData,
          is_default: addresses.find(a => a.id === editingId)?.is_default || false,
        });
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        });
      } else {
        // Add new address
        await createAddress({
          ...formData,
          is_default: addresses.length === 0, // First address is default
        });
        toast({
          title: 'Success',
          description: 'Address added successfully',
        });
      }
      
      setIsAdding(false);
      setFormData({ 
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save address',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (address: Address) => {
    const { id, user_id, is_default, created_at, updated_at, ...rest } = address;
    setFormData({
      full_name: rest.full_name,
      phone: rest.phone,
      address_line1: rest.address_line1,
      address_line2: rest.address_line2 || '',
      city: rest.city,
      state: rest.state,
      postal_code: rest.postal_code,
      country: rest.country,
    });
    setEditingId(id || null);
    setIsAdding(true);
  };

  // Set as default handler
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast({
        title: 'Success',
        description: 'Default address updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set default address',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        toast({
          title: 'Success',
          description: 'Address deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting address:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete address',
          variant: 'destructive',
        });
      }
    }
  };



  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <PageLayout title="Address Book">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-garamond">My Addresses</h1>
          {!isAdding && (
            <Button 
              onClick={() => {
                setFormData({
                  full_name: '',
                  phone: '',
                  address_line1: '',
                  address_line2: '',
                  city: '',
                  state: '',
                  postal_code: '',
                  country: 'United States',
                });
                setEditingId(null);
                setIsAdding(true);
              }}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          )}
        </div>

        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-garamond mb-4">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
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
                {editingId ? 'Update Address' : 'Save Address'}
              </Button>
            </div>
          </form>
        ) : null}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Loader2 className="w-6 h-6 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 && !isAdding ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
              <Button 
                onClick={() => setIsAdding(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            addresses.map(address => (
              <div 
                key={address.id} 
                className={`border rounded-lg p-6 relative ${address.is_default ? 'border-black' : 'border-gray-200'}`}
              >
                {address.is_default && (
                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <div className="font-garamond text-lg mb-2">{address.full_name}</div>
                <div className="text-gray-700 space-y-1">
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                  <p className="mt-2">Phone: {address.phone}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2 sm:space-x-3 sm:flex-nowrap mt-4">
  {/* Responsive mobile styles for action buttons */}
  <style>{`
    @media (max-width: 640px) {
      .address-action-btn {
        flex: 1 1 100%;
        min-width: 0;
        justify-content: flex-start;
      }
    }
  `}</style>
                  {!address.is_default && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSetDefault(address.id!)}
                      className="text-gray-600 hover:bg-transparent hover:underline address-action-btn"
                    >
                      Set as default
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(address)}
                    className="text-gray-600 hover:bg-transparent hover:underline address-action-btn"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(address.id!)}
                    className="text-red-600 hover:bg-transparent hover:underline address-action-btn"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AddressBookPage;
