import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onResend: () => void;
  onReturnToLogin: () => void;
  isResending: boolean;
  resendSuccess: boolean;
  resendError: string | null;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onClose,
  onResend,
  onReturnToLogin,
  isResending,
  resendSuccess,
  resendError,
}) => (
  <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
    <DialogContent className="sm:max-w-md text-center">
      <DialogHeader>
        <DialogTitle className="font-playfair">Confirm Your Email</DialogTitle>
      </DialogHeader>
      <div className="mb-4 text-gray-700">
        We’ve sent a confirmation link to your email address.<br />
        Please check your inbox and click the link to verify your account.
      </div>
      <Button
        className="w-full mt-2"
        onClick={onResend}
        disabled={isResending || resendSuccess}
      >
        {isResending ? 'Resending…' : resendSuccess ? 'Sent!' : 'Resend Confirmation Email'}
      </Button>
      {resendError && <div className="text-red-500 text-sm mt-2">{resendError}</div>}
      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={onReturnToLogin}
      >
        Return to Login
      </Button>
    </DialogContent>
  </Dialog>
);
