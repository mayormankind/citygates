import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Branch } from '@/lib/types';


// Define permissions grouped by categories
const permissionCategories = {
  Roles: ["View Roles", "Create Roles", "Edit Roles"],
  Plans: ["View Plans", "Create Plans", "Edit Plans", "Pause/Resume Plans"],
  Users: ["View Users", "View Prospects", "Onboard Prospects", "Create User", "Edit User Profile", "Send Message", "Approve/Reject KYC", "Activate/Deactivate User", "Assign Admin", "Add New Plan", "Place Withdrawals", "Place Deposit"],
  Transactions: ["View Transactions", "Approve/Reject Withdrawal", "Approve/Reject Deposit"],
  Admins: ["View Admins", "Create Admins", "Edit Profile", "Change Password", "Activate/Deactivate Admin"],
  Branches: ["View Branches", "Create Branch", "Edit Branch"],
  Broadcasts: ["View Broadcasts", "Send Broadcasts"],
  Store: ["View Products", "Create Product", "Edit Product", "Hide/Show Product"],
};

type PermissionCategory = keyof typeof permissionCategories;

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [roleType, setRoleType] = useState<'General' | 'Branch' | 'Assigned'>('General');
  const [branchId, setBranchId] = useState(''); 
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  useEffect(() => {
    const unsubscribeBranches = onSnapshot(collection(db, "branches"), (snapshot) => {
      const branchesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Branch[];
      setBranches(branchesData);
      setLoading(false);
    });
    return () => unsubscribeBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('Please enter a role name.');
      return;
    }
    try {
      await addDoc(collection(db, 'roles'), {
        name: roleName,
        permissions: selectedPermissions,
        roleType,
        branchId: roleType === 'Branch' ? branchId : null,
        createdAt: serverTimestamp(),
      });
      toast.success('Role created successfully!');
      setRoleName('');
      setRoleType('General');
      setBranchId('');
      setSelectedPermissions([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role.');
    }
  };

  const handleCategoryToggle = (category: PermissionCategory, checked: boolean) => {
    const categoryPermissions = permissionCategories[category];
    setSelectedPermissions((prev) =>
      checked
        ? [...new Set([...prev, ...categoryPermissions])]
        : prev.filter((perm) => !categoryPermissions.includes(perm))
    );
  };

  const isCategorySelected = (category: PermissionCategory) => {
    const categoryPermissions = permissionCategories[category];
    return categoryPermissions.every((perm) => selectedPermissions.includes(perm));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Define a new role with specific permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
              Enter Role Name
            </label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Role Name"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Role Type</label>
            <div className="flex space-x-6">
              {['General Access', 'Branch Access', 'Assigned Access'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="roleType"
                    value={type.replace(' Access', '')}
                    checked={roleType === type.replace(' Access', '')}
                    onChange={() => setRoleType(type.replace(' Access', '') as 'General' | 'Branch' | 'Assigned')}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          {roleType === 'Branch' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Branch</label>
              <Select value={branchId} onValueChange={setBranchId}>
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
            </div>
          )}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Permissions
            </label>
            {Object.entries(permissionCategories).map(([category, perms]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox className='data-[state=checked]:bg-purple-900'
                    checked={isCategorySelected(category as PermissionCategory)}
                    onCheckedChange={(checked) => handleCategoryToggle(category as PermissionCategory, checked as boolean)}
                  />
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="ml-6 grid grid-cols-2 gap-2">
                  {perms.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox className='data-[state=checked]:bg-purple-900'
                        checked={selectedPermissions.includes(perm)}
                        onCheckedChange={(checked) => {
                          setSelectedPermissions((prev) =>
                            checked ? [...prev, perm] : prev.filter((p) => p !== perm)
                          );
                        }}
                      />
                      <span className="text-sm">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700">
            Create Role
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}