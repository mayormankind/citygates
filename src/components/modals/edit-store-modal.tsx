import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Store } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define Zod schema for form validation
const editStoreSchema = z.object({
  image: z.string().url('Please upload a valid image'),
  name: z.string().min(2, 'Product name must be at least 2 characters').max(50, 'Product name is too long'),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g., 100 or 100.00)')
    .refine((val) => parseFloat(val) >= 0, 'Price cannot be negative'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200, 'Description is too long'),
});

type FormData = z.infer<typeof editStoreSchema>;

interface EditStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store;
}

export default function EditStoreModal({ open, onOpenChange, store }: EditStoreModalProps) {
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      image: store.image || '',
      name: store.name || '',
      price: store.price !== undefined && store.price !== null ? String(store.price) : '',
      description: store.description || '',
    },
  });

  const imageUrl = watch('image');

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const { url } = await uploadToCloudinary(file, 'store');
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

  // Handle form submission (update existing store)
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const storeRef = doc(db, 'stores', store.id);
      await updateDoc(storeRef, {
        image: data.image || store.image, // Preserve old image if new one not uploaded
        name: data.name,
        price: data.price,
        description: data.description,
      });

      toast.success('Store updated', {
        description: 'The store details have been successfully updated.',
      });

      reset({
        image: data.image || store.image,
        name: data.name,
        price: data.price,
        description: data.description,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error', {
        description: 'Failed to update the store.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>Update the details of the selected store.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={imageUrl || store.image || '/placeholder.svg'} />
                <AvatarFallback>
                  {watch('name')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase() || 'ST'}
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
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., Premium Product"
              {...register('name')}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Product Price</Label>
            <Input
              id="price"
              placeholder="e.g., 100.00"
              type="text"
              {...register('price')}
              disabled={loading}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Product Description</Label>
            <Input
              id="description"
              placeholder="e.g., This is a premium product."
              {...register('description')}
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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