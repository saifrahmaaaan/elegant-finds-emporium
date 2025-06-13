
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onModeChange: () => void;
  onClose: () => void;
}

import { EmailVerificationModal } from './EmailVerificationModal';

export const SignupForm = ({ onModeChange, onClose }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setShowVerification(true);
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
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
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-garamond">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="font-garamond"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-garamond">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="font-garamond"
            />
          </div>
        </div>
        
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onModeChange}
            className="text-black hover:text-black/80 font-garamond"
          >
            Already have an account? Sign in
          </Button>
        </div>
      </form>
      <EmailVerificationModal
        open={showVerification}
        onClose={() => { setShowVerification(false); onModeChange(); }}
        onResend={handleResend}
        onReturnToLogin={() => { setShowVerification(false); onModeChange(); }}
        isResending={isResending}
        resendSuccess={resendSuccess}
        resendError={resendError}
      />
    </>
  );
};
