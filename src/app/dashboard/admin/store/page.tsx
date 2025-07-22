"use client";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Permission, Store } from "@/lib/types";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AddStoreModal from "@/components/modals/add-store-modal";
import { Switch } from "@/components/ui/switch";
import EditStoreModal from "@/components/modals/edit-store-modal";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/context/AdminContext";

export default function Products() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { admin, permissions } = useAuth();
  const hasPermission = (permission: Permission) =>
    permissions.includes("all") || permissions.includes(permission);

  useEffect(() => {
    const unsubscribeStores = onSnapshot(
      collection(db, "stores"),
      (snapshot) => {
        const storesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Store[];
        setStores(storesData);
        setLoading(false);
      }
    );
    return () => unsubscribeStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStore = (storeId: string) => {
    const storeToEdit = stores.find((s) => s.id === storeId);
    if (storeToEdit) {
      setSelectedStore(storeToEdit);
      setShowEditModal(true);
    } else {
      toast.error("Store not found.");
    }
  };

  const handleStoreStatusChange = async (
    storeId: string,
    isActive: boolean
  ) => {
    setLoading(true);
    const newStatus = isActive ? "active" : "inactive";
    try {
      const storeRef = doc(db, "stores", storeId);
      await updateDoc(storeRef, { status: newStatus });
      toast.success(`Store ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating store status:", error);
      toast.error("Failed to update store status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!hasPermission("Delete Product")) {
      toast.error("You do not have permission to delete products.");
      return;
    }
    setLoading(true);
    try {
      const storeRef = doc(db, "stores", storeId);
      await deleteDoc(storeRef);
      toast.success("Store deleted", {
        description: "The store has been successfully deleted.",
      });
      setShowDeleteDialog(false);
      setSelectedStore(null);
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Failed to delete store", {
        description: "An error occurred while deleting the store.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredPermission="View Products">
      <div className="flex flex-col gap-8 p-4 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">
              Stores
            </h1>
            <p className="text-gray-600 m-0">
              Manage your store inventory and orders here.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowAddModal(true)}
              disabled={!hasPermission("Create Product")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search stores by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading stores...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : stores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No stores available. Please add a store.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <Image
                          src={store.image}
                          alt={store.name}
                          width={1000}
                          height={1000}
                          className="w-12 h-12 rounded-md"
                        />
                      </TableCell>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>
                        <Switch
                          checked={store.status === "active"}
                          onCheckedChange={(checked: boolean) =>
                            handleStoreStatusChange(store.id, checked)
                          }
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>{store.price}</TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize ${store.status === "active" ? "bg-green-100 text-green-800" : store.status === "inactive" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {store.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{store.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            className="bg-blue-600 text-white"
                            variant="ghost"
                            title="Edit Product"
                            onClick={() => handleEditStore(store.id)}
                            disabled={loading}
                          >
                            <Edit
                              aria-label="Edit Product"
                              className="h-4 w-4"
                            />
                          </Button>
                          <Button
                            className="bg-red-600 text-white"
                            variant="ghost"
                            title="Delete Product"
                            onClick={() => {
                              setSelectedStore(store);
                              setShowDeleteDialog(true);
                            }}
                            disabled={loading}
                          >
                            <Trash2
                              aria-label="Delete Product"
                              className="h-4 w-4"
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {showAddModal && (
          <AddStoreModal
            open={showAddModal}
            onOpenChange={setShowAddModal}
            Stores={[]}
          />
        )}

        {showEditModal && selectedStore && (
          <EditStoreModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            store={selectedStore}
          />
        )}

        {showDeleteDialog && selectedStore && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the store "
                  {selectedStore.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteStore(selectedStore.id)}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ProtectedRoute>
  );
}
