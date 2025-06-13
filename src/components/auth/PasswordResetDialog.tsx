import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
      toast({ title: 'Password reset email sent!', description: 'Check your inbox.' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-center">Reset Password</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="resetEmail">Email</Label>
          <Input
            id="resetEmail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            disabled={sent}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSend} disabled={loading || sent || !email} className="w-full bg-black text-white">
            {sent ? 'Sent!' : loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
