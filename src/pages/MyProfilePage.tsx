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
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-garamond mb-4">
          {user.email?.[0]?.toUpperCase()}
        </div>
        <div className="text-xl font-garamond">{user.email}</div>
        <Button className="bg-black text-white" onClick={signOut}>Sign Out</Button>
      </div>
    </PageLayout>
  );
};

export default MyProfilePage;
