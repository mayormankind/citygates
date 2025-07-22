import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Admin, User } from "@/lib/types";
import { toast } from "sonner";

interface ManageAdminsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  adminsList: Admin[];
  onAdminsUpdate: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function ManageAdminsModal({
  open,
  onOpenChange,
  user,
  adminsList,
  onAdminsUpdate,
  loading,
  setLoading,
}: ManageAdminsModalProps) {
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  useEffect(() => {
    setSelectedAdmins([]);
  }, [user]);

  const handleUpdateAdmins = async () => {
    if (selectedAdmins.length === 0) {
      toast.error("Please select at least one admin.");
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        admins: selectedAdmins,
        branch:
          selectedAdmins.length > 0
            ? adminsList.find((admin) => admin.id === selectedAdmins[0])?.branch
            : null,
      });
      toast.success(
        `Updated ${selectedAdmins.length} admin(s) for ${user.name}`
      );
      onAdminsUpdate();
    } catch (error) {
      console.error("Error updating admins:", error);
      toast.error("Failed to update admins.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Admins for {user.name}</DialogTitle>
          <DialogDescription>
            Assign or update admins for this user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Select
              onValueChange={(value) => {
                if (!selectedAdmins.includes(value)) {
                  setSelectedAdmins((prev) => [...prev, value]);
                }
              }}
              value=""
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Admins" />
              </SelectTrigger>
              <SelectContent>
                {adminsList
                  .filter((admin) => !selectedAdmins.includes(admin.id))
                  .map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.email}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="mt-2">
              {selectedAdmins.map((adminId) => {
                const admin = adminsList.find((a) => a.id === adminId);
                return admin ? (
                  <span
                    key={adminId}
                    className="inline-block bg-gray-200 rounded-full px-2 py-1 mr-1 mb-1"
                  >
                    {admin.email}{" "}
                    <button
                      onClick={() =>
                        setSelectedAdmins(
                          selectedAdmins.filter((id) => id !== adminId)
                        )
                      }
                      className="ml-1 text-red-500"
                    >
                      x
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleUpdateAdmins}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
