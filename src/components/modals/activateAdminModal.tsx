import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Loader2 } from 'lucide-react';
import { Admin } from '@/lib/types';

interface ActivateAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin;
  onActivate: (userId: string, newStatus: "active" | "restricted") => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function ActivateAdminModal({ open, onOpenChange, admin, onActivate, loading, setLoading }: ActivateAdminModalProps) {
  const handleConfirmActivate = async () => {
    setLoading(true);
    try {
      await onActivate(admin.id, "active");
    } catch (error) {
      console.error("Activation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Activate Admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to activate {admin.email}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={handleConfirmActivate}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}