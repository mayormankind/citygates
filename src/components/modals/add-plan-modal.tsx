import { Camera, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Plan } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

// Define Zod schema for form validation
const planSchema = z.object({
  image: z.string().url('Please upload a valid image').optional(),
  name: z.string().min(3, 'Plan name must be at least 3 characters').max(50, 'Plan name is too long'),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number (e.g., 100 or 100.00)')
    .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0'),
  tenure: z
    .string()
    .regex(/^\d+$/, 'Tenure must be a valid number of days')
    .refine((val) => parseInt(val) >= 1, 'Tenure must be at least 1 day'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description is too long'),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Status must be active or inactive' }),
  }),
});

type FormData = z.infer<typeof planSchema>;

interface AddPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  Plans: Plan[];
}

export default function AddPlanModal({ open, onOpenChange, Plans }: AddPlanModalProps) {
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      image: '',
      name: '',
      amount: '',
      tenure: '',
      description: '',
      status: 'inactive',
    },
  });

  const imageUrl = watch('image');

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const { url } = await uploadToCloudinary(file, 'plans');
      setValue('image', url);
      toast.success('Image uploaded', {
        description: 'Profile image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Upload failed', {
        description: 'Failed to upload image. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const planData = {
        image: data.image || '',
        name: data.name,
        amount: data.amount,
        tenure: data.tenure,
        description: data.description,
        status: data.status,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'plans'), planData);

      toast.success('Plan created', {
        description: 'The plan has been successfully created.',
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error', {
        description: 'Failed to create the plan.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Plan</DialogTitle>
          <DialogDescription>Create a new subscription plan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={imageUrl || '/placeholder.svg'} />
                <AvatarFallback>
                  {watch('name')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'PL'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image')?.click()}
                  disabled={loading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              placeholder="e.g., Premium Plan"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount per day</Label>
            <Input
              id="amount"
              placeholder="e.g., 100.00"
              type="text"
              {...register('amount')}
              disabled={loading}
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenure">Tenure</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="tenure"
                type="text"
                placeholder="e.g., 30"
                {...register('tenure')}
                disabled={loading}
              />
              <span>days</span>
            </div>
            {errors.tenure && <p className="text-red-500 text-xs">{errors.tenure.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Plan Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., This is a premium plan that runs for 30 days."
              {...register('description')}
              disabled={loading}
              className="min-h-[100px]"
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value as "active" | "inactive")}
              defaultValue={watch('status')}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}