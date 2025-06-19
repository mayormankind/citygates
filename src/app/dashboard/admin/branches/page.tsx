"use client";
import { app, db } from '@/lib/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Loader2, Plus, Search, Trash2 } from 'lucide-react'; // Removed unused Delete, Pause, Play
import React, { useEffect, useState } from 'react';
import AddBranchModal from '@/components/modals/add-branch-modal';
import Image from 'next/image';
import { Branch } from '@/lib/types';
import { collection, doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore'; // Added deleteDoc
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'; // Added Dialog components
import EditBranchModal from '@/components/modals/edit-branch-modal';

export default function Branches() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null); // Branch to edit or delete
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBranchStatusChange = async (branchId: string, newStatus: 'active' | 'inactive') => {
    setLoading(true);
    try {
      const branchRef = doc(db, "branches", branchId);
      await updateDoc(branchRef, { status: newStatus });
      toast.success(`Branch ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating branch status:", error);
      toast.error("Failed to update branch status.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branchId: string) => {
    const branchToEdit = branches.find((b) => b.id === branchId);
    if (branchToEdit) {
      setSelectedBranch(branchToEdit);
      setShowEditModal(true);
    } else {
      toast.error("Branch not found.");
    }
  };

  const handleDelete = async (branchId: string) => {
    setLoading(true);
    try {
      const branchRef = doc(db, "branches", branchId);
      await deleteDoc(branchRef);
      toast.success("Branch deleted", {
        description: "The branch has been successfully deleted.",
      });
      setShowDeleteDialog(false); 
      setSelectedBranch(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error("Failed to delete branch", {
        description: "An error occurred while deleting the branch.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">Branches</h1>
          <p className="text-gray-600 m-0">Manage your subscription branches</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
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
                  placeholder="Search branches by name or location..."
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
                <TableHead className="w-1/4">S/N</TableHead>
                <TableHead className="w-1/4">Branch Name</TableHead>
                <TableHead className="w-1/4">Created At</TableHead>
                <TableHead className="w-1/4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading branches...
                    </div>
                  </TableCell>
                </TableRow>
              ) : branches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No branches available. Please add a branch.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch, id) => (
                  <TableRow key={branch.id}>
                    <TableCell className="w-1/4">{id + 1}</TableCell>
                    <TableCell className="w-1/4">{branch.name}</TableCell>
                    <TableCell className="w-1/4">
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-1/4">
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-blue-600 text-white"
                          variant="ghost"
                          title="Edit Branch"
                          onClick={() => handleEdit(branch.id)}
                          disabled={loading}
                        >
                          <Edit aria-label="Edit Branch" className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-red-600 text-white"
                          variant="ghost"
                          title="Delete Branch"
                          onClick={() => {
                            setSelectedBranch(branch);
                            setShowDeleteDialog(true);
                          }}
                          disabled={loading}
                        >
                          <Trash2 aria-label="Delete Branch" className="h-4 w-4" />
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

      {showAddModal && <AddBranchModal open={showAddModal} onOpenChange={setShowAddModal} Branches={[]} />}
      {showEditModal && selectedBranch && (
        <EditBranchModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          branch={selectedBranch}
        />
      )}
      {showDeleteDialog && selectedBranch && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the branch "{selectedBranch.name}"? This action cannot be undone.
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
                onClick={() => handleDelete(selectedBranch.id)}
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
  );
}