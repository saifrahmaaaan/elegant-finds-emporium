
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

export const SignupForm = ({ onModeChange, onClose }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          }
        }
      });

      if (error) {
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
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

  return (
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

      <div className="space-y-2">
        <Label htmlFor="role" className="font-garamond">Account Type</Label>
        <Select value={role} onValueChange={(value: 'buyer' | 'seller') => setRole(value)}>
          <SelectTrigger className="font-garamond">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer" className="font-garamond">Buyer</SelectItem>
            <SelectItem value="seller" className="font-garamond">Seller</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full luxury-gold-gradient text-black font-garamond"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onModeChange}
          className="text-accent hover:text-accent/80 font-garamond"
        >
          Already have an account? Sign in
        </Button>
      </div>
    </form>
  );
};
