import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Branch, Prospect, State, User } from '@/lib/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const userSchema = z.object({
  branch: z.string().min(1, 'Assign a branch to this user'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name is too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be 10 digits (excluding +234)'),
  state: z.string().min(1, 'Please select a state'),
  lga: z.string().min(1, 'Please select a local government area'),
  streetAddress: z.string().min(5, 'Street address must be at least 5 characters').max(200, 'Street address is too long'),
});

type FormData = z.infer<typeof userSchema>;

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Prospect; // Pass the user object to edit
}

export default function AddProspectModal({ open, onOpenChange, user }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState(user.state || '');
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user.email,
      phoneNumber: String(user.phoneNumber),
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ')[1] || '',
      state: user.state || '',
      lga: user.lga || '',
      streetAddress: user.streetAddress || '',
      branch: ''
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

  // Fetch branches
  useEffect(() => {
    setLoadingBranches(true);
    const unsubscribeBranches = onSnapshot(collection(db, "branches"), (snapshot) => {
      const branchesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Branch[];
      setBranches(branchesData);
      setLoadingBranches(false);
    }, (error) => {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches.");
      setLoadingBranches(false);
    });
    return () => unsubscribeBranches();
  }, []);

  // Handle form submission (update existing user)
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const storeData = {
        name: `${data.firstName} ${data.lastName}`,
        phoneNumber: `+234${data.phoneNumber}`,
        branch: data.branch || '',
        status: 'pending',
        kyc: 'pending',
        admins: 0,
        createdAt: serverTimestamp(),
        role: 'user',
        email: data.email,
        state: data.state,
        lga: data.lga,
        streetAddress: data.streetAddress,
      };
    
      await addDoc(collection(db, 'users'), storeData);
      await deleteDoc(doc(db,"prospects", user.id))
    
      toast.success('User created', {
        description: 'The user has been successfully created.',
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
          <DialogTitle>Assign User</DialogTitle>
          <DialogDescription>Update the details of the selected user.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">

          <div className="space-y-1">
            <Label htmlFor="branch">Branch</Label>
            <Select onValueChange={(value) => setValue('branch', value)}
              value={watch('branch')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Branches</SelectLabel>
                  {loadingBranches ? (
                    <div className="p-2 text-sm text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin" /> Loading branches...
                    </div>
                  ) : branches.length > 0 ? (
                    branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No branches available</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.branch && (
                <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phonenumber">Phone Number</Label>
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">+234</span>
              <div className="flex-1">
                <Input
                  placeholder="Enter phone number (10 digits)"
                  className="shadow-none"
                  {...register('phoneNumber')}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Email Address"
              className="shadow-none"
              {...register('email')}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
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

          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Select
              onValueChange={(value) => setValue('state', value)}
              value={watch('state')}
              disabled={loading}
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

          <div className="space-y-1">
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

          <div className="space-y-1">
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