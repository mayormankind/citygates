import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { User } from "@/lib/types";

interface ActivateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onActivate: (
    userId: string,
    user: User,
    newStatus: "active" | "restricted"
  ) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function ActivateUserModal({
  open,
  onOpenChange,
  user,
  onActivate,
  loading,
  setLoading,
}: ActivateUserModalProps) {
  const handleConfirmActivate = async () => {
    setLoading(true);
    try {
      await onActivate(user.id, user, "active");
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
          <DialogTitle>Activate User</DialogTitle>
          <DialogDescription>
            Are you sure you want to activate {user.name}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
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
