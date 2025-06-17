import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';

const MyProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <PageLayout title="My Profile">
      <div className="flex flex-col items-center w-full bg-white px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Profile Image and Email */}
          <div className="flex flex-col items-center w-full mb-16">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-garamond mb-4">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="text-xl font-garamond break-all text-center">{user.email}</div>
            {/* Welcome Name */}
            <div className="mt-3 text-3xl md:text-4xl font-garamond font-bold text-center">
              {`WELCOME${user.user_metadata?.first_name || user.user_metadata?.last_name ? ` ${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}` : ''}`.trim()}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full mb-8">
            <div className="flex flex-col items-center">
              <button onClick={() => navigate('/my-orders')} className="group relative font-garamond font-semibold focus:outline-none">
                <span className="relative">
                  My Orders
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
              <span className="text-xs text-gray-500 mt-2 text-center">Manage and edit your orders.</span>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => navigate('/address-book')} className="group relative font-garamond font-semibold focus:outline-none">
                <span className="relative">
                  Address Book
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
              <span className="text-xs text-gray-500 mt-2 text-center">Manage shipping & billing addresses.</span>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => navigate('/wallet')} className="group relative font-garamond font-semibold focus:outline-none">
                <span className="relative">
                  Wallet
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
              <span className="text-xs text-gray-500 mt-2 text-center">Manage your payment methods.</span>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={() => navigate('/account-settings')} className="group relative font-garamond font-semibold focus:outline-none">
                <span className="relative">
                  Account Settings
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
              <span className="text-xs text-gray-500 mt-2 text-center">Edit your account details.</span>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <div className="w-full flex justify-center mt-6 mb-2">
            <Button className="bg-black text-white w-full md:w-1/2" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MyProfilePage;
