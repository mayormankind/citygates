import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Role } from '@/lib/types';

// Define permissions grouped by categories
const permissionCategories = {
  Roles: ["View Roles", "Edit Roles"],
  Plans: ["View Plans", "Edit Plans", "Pause/Resume Plans"],
  Users: ["View Users", "Onboard Prospects", "Edit User", "Send Message", "Approve/Reject KYC", "Activate/Deactivate User"],
  Transactions: ["View Transactions", "Approve/Reject Withdrawal", "Approve/Reject Deposit"],
  Admins: ["View Admins", "Create Admins", "Edit Profile", "Send Message", "Activate/Deactivate Admin"],
  Branches: ["View Branches", "Edit Branch"],
  Broadcasts: ["View Broadcasts", "Send Broadcasts"],
  Store: ["View Products", "Create Product", "Edit Product", "Hide/Show Product"],
};

type PermissionCategory = keyof typeof permissionCategories;

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export default function EditRoleModal({ open, onOpenChange, role }: EditRoleModalProps) {
  const [roleName, setRoleName] = useState('');
  const [roleType, setRoleType] = useState<'General' | 'Branch' | 'Assigned'>('General');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Load existing role data when the modal opens
  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setRoleType('General' as 'General' | 'Branch' | 'Assigned');
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error('Please enter a role name.');
      return;
    }
    if (!role?.id) {
      toast.error('No role selected for editing.');
      return;
    }
    try {
      const roleRef = doc(db, 'roles', role.id);
      await updateDoc(roleRef, {
        name: roleName,
        permissions: selectedPermissions,
        updatedAt: serverTimestamp(), 
      });
      toast.success('Role updated successfully!');
      setRoleName('');
      setSelectedPermissions([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role.');
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
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Modify the existing role and its permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
              Role Name
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
            <label className="block text-sm font-medium text-gray-700">Role Type</label>
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
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select Permissions</label>
            {Object.entries(permissionCategories).map(([category, perms]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="data-[state=checked]:bg-purple-900"
                    checked={isCategorySelected(category as PermissionCategory)}
                    onCheckedChange={(checked) => handleCategoryToggle(category as PermissionCategory, checked as boolean)}
                  />
                  <span className="text-sm font-medium">{category}</span>
                </div>
                <div className="ml-6 grid grid-cols-2 gap-2">
                  {perms.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox
                        className="data-[state=checked]:bg-purple-900"
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
            Update Role
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}