import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Loader2 } from 'lucide-react';
import { Admin } from '@/lib/types';

interface RestrictAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin;
  onActivate: (adminId: string, newStatus: "active" | "restricted") => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function RestrictAdminModal({ open, onOpenChange, admin, onActivate, loading, setLoading }: RestrictAdminModalProps) {
  const handleConfirmRestrict = async () => {
    setLoading(true);
    try {
      await onActivate(admin.id, "restricted");
    } catch (error) {
      console.error("Restriction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restrict admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to restrict {admin.email}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleConfirmRestrict}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Restrict
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}