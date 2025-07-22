import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Branch } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define Zod schema for form validation
const editBranchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters').max(50, 'Branch name is too long'),
});

type FormData = z.infer<typeof editBranchSchema>;

interface EditBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch; // Pass the branch object to edit
}

export default function EditBranchModal({ open, onOpenChange, branch }: EditBranchModalProps) {
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editBranchSchema),
    defaultValues: {
      name: branch.name || '',
    },
  });

  // Handle form submission (update existing branch)
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const branchRef = doc(db, 'branches', branch.id);
      await updateDoc(branchRef, { name: data.name });

      toast.success('Branch updated', {
        description: 'The branch details have been successfully updated.',
      });

      reset({ name: data.name }); // Reset form with updated value
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error', {
        description: 'Failed to update the branch.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>Update the details of the selected branch.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Branch Name</Label>
            <Input
              id="name"
              placeholder="e.g., Enter branch name"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}