import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Admin, Branch, Role } from '@/lib/types'; // Added Role type
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { useForm, Controller } from 'react-hook-form'; // Updated to use Controller
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits (excluding +234)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.string().min(1, 'Please select a role'),
  branch: z.string().min(1, 'Please select a branch'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof adminSchema>;

interface CreateAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAdminModal({ open, onOpenChange }: CreateAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]); // Changed to Role[] type
  const [branches, setBranches] = useState<Branch[]>([]);
  const auth = getAuth();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: '',
      branch: '',
    },
  });

  // Fetch roles and branches from Firestore
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesSnapshot = await getDocs(collection(db, "roles"));
        const roleData = rolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id, // Use name field, fallback to id
          permissions: doc.data().permissions || [],
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Role[];
        setRoles(roleData);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    };

    const fetchBranches = async () => {
      try {
        const branchesSnapshot = await getDocs(collection(db, "branches"));
        const branchData = branchesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Branch[];
        setBranches(branchData);
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches");
      }
    };

    fetchRoles();
    fetchBranches();
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;

      const adminData: Omit<Admin, 'id'> = {
        email: data.email,
        phoneNumber: `+234${data.phoneNumber}`,
        role: data.role,
        branch: data.branch,
        status: 'active',
        createdAt: serverTimestamp(),
        uid,
      };

      await addDoc(collection(db, 'admins'), adminData);

      toast.success('Admin created', {
        description: 'The admin has been successfully created and can log in with the provided credentials.',
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error creating admin', {
        description: (error as any)?.message || 'Failed to create the admin. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
          <DialogDescription>Create a new admin account by the super admin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter Email"
              {...register('email')}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">+234</span>
              <div className="flex-1">
                <Input
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  {...register('phoneNumber')}
                  disabled={loading}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Choose password for admin</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter Password"
              {...register('password')}
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Re-Enter password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-Enter Password"
              {...register('confirmPassword')}
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading || roles.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">Loading roles...</div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="branch">Branch</Label>
            <Controller
              control={control}
              name="branch"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading || branches.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      {branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">Loading branches...</div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Admin'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}