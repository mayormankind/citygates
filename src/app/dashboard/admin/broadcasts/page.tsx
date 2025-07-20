"use client";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import BroadcastModal from "@/components/modals/broadcast-modal";
import { Permission, User } from "@/lib/types";
import { getRoleName } from "@/lib/utils";
import { useAuth } from "@/context/AdminContext";
import { useBranchRole } from "@/context/BranchRoleContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

interface Broadcast {
  id: string;
  message: string;
  recipients: string[];
  createdAt: Date;
}

export default function Broadcast() {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { roles } = useBranchRole();
  const { admin, permissions } = useAuth();
  const [roleType, setRoleType] = useState<"General" | "Branch" | "Assigned">(
    "General"
  );
  const role = getRoleName(admin?.role ?? "", roles);

  const hasPermission = (permission: Permission) =>
    permissions.includes("all") || permissions.includes(permission);

  // Fetch broadcasts and users
  useEffect(() => {
    const unsubscribeBroadcasts = onSnapshot(
      collection(db, "broadcasts"),
      (snapshot) => {
        const broadcastsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message || "",
          recipients: doc.data().recipients || [],
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setBroadcasts(broadcastsData);
        setLoading(false);
      }
    );

    const q = hasPermission("all")
      ? collection(db, "users")
      : roleType === "Assigned"
        ? query(
            collection(db, "users"),
            where("admins", "array-contains", admin?.uid ?? "")
          )
        : query(
            collection(db, "users"),
            where("branch", "==", admin?.branch ?? "")
          );
    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        phoneNumber: doc.data().phoneNumber || "",
        branch: doc.data().branch || "",
      })) as User[];
      setUsers(usersData);
    });

    return () => {
      unsubscribeBroadcasts();
      unsubscribeUsers();
    };
  }, [admin?.branch, admin?.uid, roleType, permissions]);

  // Handle delete broadcast
  const handleDelete = async (id: string) => {
    if (!hasPermission("Send Broadcasts")) {
      toast.error("You do not have permission to delete broadcasts.");
      return;
    }
    setLoading(true);
    try {
      await deleteDoc(doc(db, "broadcasts", id));
      toast.success("Broadcast deleted successfully");
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      toast.error("Failed to delete broadcast");
    } finally {
      setLoading(false);
    }
  };

  console.log(users);

  // Get phone numbers for a broadcast
  const getRecipientPhones = (recipients: string[]) => {
    if (recipients[0] === "all") {
      return users.map((user) => user.phoneNumber).filter(Boolean);
    }
    return users
      .filter((user) => recipients.includes(user.branch as any))
      .map((user) => user.phoneNumber)
      .filter(Boolean);
  };

  return (
    <ProtectedRoute requiredPermission="View Broadcasts">
      <div className="flex flex-col gap-8 p-4 md:px-8">
        <div className="flex flex-col justify-between md:items-center md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broadcast</h1>
            <p className="text-gray-600">
              Manage your broadcasts here. Create, edit, and delete broadcast
              messages.
            </p>
          </div>
          {role.toLowerCase() === "super admin" && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowBroadcastModal(true)}
                disabled={!hasPermission("Send Broadcasts") || loading}
              >
                <Plus className="mr-2 h-4 w-4" /> Announce / Broadcast
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Phone Numbers</TableHead>
                  {role.toLowerCase() === "super admin" && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading broadcasts...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : broadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No broadcasts available. Create your first broadcast.
                    </TableCell>
                  </TableRow>
                ) : (
                  broadcasts.map((broadcast, index) => (
                    <TableRow key={broadcast.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{broadcast.message}</TableCell>
                      <TableCell>
                        {new Date(broadcast.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {broadcast.recipients.join(", ") || "All"}
                      </TableCell>
                      <TableCell>
                        {getRecipientPhones(broadcast.recipients).length > 0
                          ? getRecipientPhones(broadcast.recipients).join(", ")
                          : "No phone numbers found"}
                      </TableCell>
                      {role.toLowerCase() === "super admin" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              title="Delete broadcast"
                              onClick={() => handleDelete(broadcast.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showBroadcastModal && (
          <BroadcastModal
            open={showBroadcastModal}
            onOpenChange={setShowBroadcastModal}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
