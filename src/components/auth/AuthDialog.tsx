
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { supabase } from '@/integrations/supabase/client';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showSocialLogin?: boolean;
}

export const AuthDialog = ({ open, onOpenChange, showSocialLogin = false }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-center">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        {showSocialLogin && (
          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 font-medium text-base text-gray-700"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <div className="text-xs text-center text-gray-400">or</div>
          </div>
        )}
        {mode === 'login' ? (
          <LoginForm onModeChange={() => setMode('signup')} onClose={() => onOpenChange(false)} />
        ) : (
          <SignupForm onModeChange={() => setMode('login')} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};
