import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Supabase injects access_token etc. into hash fragment, so we don't need to parse it manually.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', description: 'Please confirm your new password.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated', description: 'You can now log in with your new password.' });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-garamond font-bold mb-2">Reset Password</h1>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter new password"
          disabled={loading || success}
        />
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          disabled={loading || success}
        />
        <Button type="submit" className="w-full bg-black text-white mt-4" disabled={loading || success}>
          {loading ? 'Resetting...' : success ? 'Success!' : 'Reset Password'}
        </Button>
        {success && <div className="text-green-600 text-center">Password updated! Redirecting...</div>}
      </form>
      <Footer />
    </>
  );
}
