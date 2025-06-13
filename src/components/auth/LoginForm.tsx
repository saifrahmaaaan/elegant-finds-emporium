
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailVerificationModal } from './EmailVerificationModal';

interface LoginFormProps {
  onModeChange: () => void;
  onClose: () => void;
}

export const LoginForm = ({ onModeChange, onClose }: LoginFormProps) => {
  const [showVerification, setShowVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Supabase returns specific error code for unconfirmed email
        if (
          error.message.toLowerCase().includes('email') &&
          (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verified'))
        ) {
          setShowVerification(true);
        } else {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend confirmation logic
  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setResendError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) {
        setResendError(error.message);
      } else {
        setResendSuccess(true);
      }
    } catch (err: any) {
      setResendError('Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };


  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-garamond">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-garamond"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="font-garamond">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="font-garamond"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black text-white font-garamond hover:bg-black/90"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onModeChange}
            className="text-black hover:text-black/80 font-garamond"
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </form>
      <EmailVerificationModal
        open={showVerification}
        onClose={() => { setShowVerification(false); }}
        onResend={handleResend}
        onReturnToLogin={() => { setShowVerification(false); }}
        isResending={isResending}
        resendSuccess={resendSuccess}
        resendError={resendError}
      />
    </>
  );
};
