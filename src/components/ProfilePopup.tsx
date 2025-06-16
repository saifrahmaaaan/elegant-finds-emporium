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
    <div
      className="ef-profile-popup fixed z-[10000] bg-white shadow-2xl border border-gray-200 animate-fade-in duration-150 flex flex-col rounded-none w-full max-w-[calc(100vw-1rem)] mx-auto left-0 right-0 mt-4 sm:rounded-none sm:w-full sm:max-w-md sm:mx-0 sm:top-6 sm:right-6 sm:left-auto sm:mt-0 p-4"
      style={{
        top: '1.5rem',
        right: undefined,
        left: undefined,
        marginLeft: undefined,
        marginRight: undefined,
        overflow: 'visible',
        minWidth: 0,
      }}
      onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <span className="font-garamond font-bold text-lg text-black">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</span>
        <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black text-xl">×</button>
      </div>
      {showSocialLogin && (
        <div className="flex flex-col gap-3 mb-4">
          <button
            onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-none px-3 py-2 bg-white hover:bg-gray-50 font-medium text-base text-gray-700"
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
