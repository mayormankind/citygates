import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '../ui/password-input';
import { updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig'; 
import { toast } from 'sonner';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password must match'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof resetSchema>;

interface AdminResetPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminEmail: string; 
  onPasswordChanged: () => void; 
}

export default function AdminResetPassword({
  open,
  onOpenChange,
  adminEmail,
  onPasswordChanged,
}: AdminResetPasswordProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user && user.email === adminEmail) {
        await updatePassword(user, data.password);
        toast.success("Admin's password has been changed successfully.");
        reset();
        onPasswordChanged();
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Change Password</DialogTitle>
          <DialogDescription>Change the password for the selected admin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
          <div>
            <PasswordInput
              placeholder="Enter new password"
              className="shadow-none"
              {...register('password')}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <PasswordInput
              placeholder="Confirm new password"
              className="shadow-none"
              {...register('confirmPassword')}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}