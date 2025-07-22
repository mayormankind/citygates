import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { State, User } from '@/lib/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name is too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name is too long'),
  state: z.string().min(1, 'Please select a state'),
  lga: z.string().min(1, 'Please select a local government area'),
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters').max(200, 'Street address is too long'),
});

type FormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User; // Pass the user object to edit
}

export default function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState(user.state || '');

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: user.name.split(' ')[0] || '', // Extract first name from full name
      lastName: user.name.split(' ')[1] || '', // Extract last name from full name
      state: user.state || '',
      lga: user.lga || '',
      streetAddress: user.streetAddress || '',
    },
  });

  const watchedState = watch('state');

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('https://nigerian-states-and-lga.vercel.app/');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setStates(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load states');
      }
    };
    fetchStates();
  }, []);

  // Reset LGA when state changes
  useEffect(() => {
    if (watchedState !== selectedState) {
      setSelectedState(watchedState);
      setValue('lga', '');
    }
  }, [watchedState, selectedState, setValue]);

  // Handle form submission (update existing user)
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: `${data.firstName} ${data.lastName}`,
        state: data.state,
        lga: data.lga,
        streetAddress: data.streetAddress,
      });

      toast.success('User updated', {
        description: 'The user details have been successfully updated.',
      });

      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        state: data.state,
        lga: data.lga,
        streetAddress: data.streetAddress,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error', {
        description: 'Failed to update the user.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the details of the selected user.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                className="shadow-none"
                {...register('firstName')}
                disabled={loading}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                className="shadow-none"
                {...register('lastName')}
                disabled={loading}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select
              onValueChange={(value) => setValue('state', value)}
              value={watch('state')}
              disabled={loading || states.length === 0}
            >
              <SelectTrigger className="w-full border py-4">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>States</SelectLabel>
                  {states.length > 0 ? (
                    states.map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">Loading states...</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>

          <div>
            <Label htmlFor="lga">Local Government Area</Label>
            <Select
              onValueChange={(value) => setValue('lga', value)}
              value={watch('lga')}
              disabled={loading || !watch('state')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Local Government Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>LGAs</SelectLabel>
                  {watch('state') ? (
                    states.find((state) => state.name === watch('state'))?.lgas.map((lga) => (
                      <SelectItem key={lga} value={lga}>
                        {lga}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">Select a state first</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.lga && <p className="text-red-500 text-xs mt-1">{errors.lga.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Textarea
              id="address"
              placeholder="Street Address"
              className="shadow-none"
              {...register('streetAddress')}
              disabled={loading}
            />
            {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}