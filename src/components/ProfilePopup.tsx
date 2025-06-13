import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePopupProps {
  open: boolean;
  onClose: () => void;
  showSocialLogin?: boolean;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ open, onClose, showSocialLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (!open) return null;

  // Outside click backdrop
  const backdrop = (
    <div
      className="fixed inset-0 z-[9999] bg-transparent"
      onClick={onClose}
      aria-label="Close Profile Popup Backdrop"
    />
  );

  const popup = (
    <div className="fixed top-6 right-6 z-[10000] bg-white shadow-2xl rounded-xl w-full max-w-md border border-gray-200 animate-fade-in flex flex-col p-8" style={{ overflow: 'visible' }} onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <span className="font-garamond font-bold text-lg text-black">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</span>
        <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black text-xl">×</button>
      </div>
      {showSocialLogin && (
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 font-medium text-base text-gray-700"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <div className="text-xs text-center text-gray-400">or</div>
        </div>
      )}
      {mode === 'login' ? (
        <LoginForm onModeChange={() => setMode('signup')} onClose={onClose} />
      ) : (
        <SignupForm onModeChange={() => setMode('login')} onClose={onClose} />
      )}
    </div>
  );

  return ReactDOM.createPortal(<>{backdrop}{popup}</>, document.body);
};
