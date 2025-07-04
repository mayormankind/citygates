"use client";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Loader2, Plus, Search, MessageSquare, Users, DollarSign, Lock, BadgeCheck, ThumbsUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Admin, Branch, User } from "@/lib/types";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AddUserModal from "@/components/modals/add-user-modal";
import EditUserModal from "@/components/modals/edit-user-modal";
import { Badge } from "@/components/ui/badge";
import KycModal from "@/components/modals/kycModal";
import ManageAdminsModal from "@/components/modals/manageAdminsModal";
import ActivateUserModal from "@/components/modals/activateUserModal";
import UserMessageModal from "@/components/modals/user-message-modal";
import RestrictUserModal from "@/components/modals/restrictUserModal";

export default function UsersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showManageAdminsModal, setShowManageAdminsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [UserToMessage, setUserToMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [adminsList, setAdminsList] = useState<Admin[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [ showUserMessageModal, setShowUserMessageModal] = useState(false);
  

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const UsersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as User[];
      setUsers(UsersData);
      setLoading(false);
    });
    return () => unsubscribeUsers();
  }, []);

  // Fetch branches
  useEffect(() => {
    setLoadingBranches(true);
    const unsubscribeBranches = onSnapshot(collection(db, "branches"), (snapshot) => {
      const branchesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Branch[];
        setBranches(branchesData);
        setLoadingBranches(false);
      }, (error) => {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches.");
        setLoadingBranches(false);
      });
      return () => unsubscribeBranches();
    }, []);

  // Fetch admins
  useEffect(() => {
    setLoading(true);
    const unsubscribeAdmins = onSnapshot(collection(db, "admins"),(snapshot) => {
      const adminsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Admin[];
      setAdminsList(adminsData);
      setLoading(false);
    },
    (error) => {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins.");
      setLoading(false);
    }
  );
  return () => unsubscribeAdmins();
}, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBranchName = (branchId: any) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  const handleUserStatusChange = async (userId: string, newStatus: "active" | "restricted") => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      setShowActivateModal(false);
      setShowRestrictModal(false);
      await updateDoc(userRef, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = (userId: string) => {
    const userToActivate = users.find((u) => u.id === userId);
    if (userToActivate) {
      if (userToActivate.admins === 0 || !userToActivate.admins) {
        setTimeout(()=>{
          toast.info("Please click 'Manage Admins' to assign an admin.");
        },2000)
        toast.error("Citygates Food Bank: Please assign at least one admin to user before activating!");
      } else {
        setSelectedUser(userToActivate);
        setShowActivateModal(true);
      }
    } else {
      toast.error("User not found.");
    }
  };

  const handleFinishKYC = (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setShowKycModal(true);
    } else {
      toast.error("User not found.");
    }
  };

  const handleManageTransactions = (userId: string) => {
    console.log("Manage transactions for user:", userId);
  };

  const handleManageAdmins = (userId: string) => {
    const userToManage = users.find((u) => u.id === userId);
    if (userToManage) {
      setSelectedUser(userToManage);
      setShowManageAdminsModal(true);
    } else {
      toast.error("User not found.");
    }
  };

  const handleSendMessage = (userId: string) => {
    console.log("Send message to user:", userId);
  };
  
  const handleEditProfile = (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setShowEditModal(true);
    } else {
      toast.error("User not found.");
    }
  };

  const handleRestrictUser = async (userId: string) => {
    const userToActivate = users.find((u) => u.id === userId);
    if(userToActivate){
      setSelectedUser(userToActivate);
      setShowRestrictModal(true);
    }
  };

  const handleKycUpdate = () => {
    setSelectedUser(null);
    setShowKycModal(false);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">Users</h1>
          <p className="text-gray-600 m-0">Manage your users here. You can view, edit, and delete users information.</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
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
                  placeholder="Search users by name, email or phone Number..."
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
                <TableHead className="w-1/8">S/N</TableHead>
                <TableHead className="w-1/8">Name</TableHead>
                <TableHead className="w-1/8">Phone Number</TableHead>
                <TableHead className="w-1/8">Branch</TableHead>
                <TableHead className="w-1/8">Status</TableHead>
                <TableHead className="w-1/8">KYC</TableHead>
                <TableHead className="w-1/8">ADMINS</TableHead>
                <TableHead className="w-1/8">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No users available. Please add a user.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, id) => (
                  <TableRow key={user.id}>
                    <TableCell className="w-1/8">{id + 1}</TableCell>
                    <TableCell className="w-1/8">{user.name}</TableCell>
                    <TableCell className="w-1/8">{user.phoneNumber}</TableCell>
                    <TableCell className="w-1/8">{getBranchName(user.branch)}</TableCell>
                    <TableCell className="w-1/8"><Badge>{user.status}</Badge></TableCell>
                    <TableCell className="w-1/8"><Badge>{user.kyc}</Badge></TableCell>
                    <TableCell className="w-1/8">{user.admins}</TableCell>
                    <TableCell className="w-1/8">
                      <div className="flex items-center gap-2">
                        {user.status === "pending" && user.kyc === "pending" ? (
                          <Button
                            variant="ghost"
                            title="Finish KYC"
                            onClick={() => handleFinishKYC(user.id)}
                            className="bg-green-600 text-white hover:text-green-700"
                          >
                            <BadgeCheck className="h-4 w-4" />
                          </Button>
                        ) : user.kyc === "approved" && user.status === "pending" ? (
                          <>
                            <Button
                              variant="ghost"
                              title="Activate User"
                              onClick={() => handleActivateUser(user.id)}
                              className="bg-green-600 text-white hover:text-green-700"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Transactions"
                              onClick={() => handleManageTransactions(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Admins"
                              onClick={() => handleManageAdmins(user.id)}
                              className="bg-purple-600 text-white hover:text-purple-700"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Send Message"
                              onClick={() => handleSendMessage(user.id)}
                              className="bg-orange-600 text-white hover:text-orange-700"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Edit Profile"
                              onClick={() => handleEditProfile(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        ) : user.kyc === "approved" && user.status === "active" ? (
                          <>
                            <Button
                              variant="ghost"
                              title="Restrict User"
                              onClick={() => handleRestrictUser(user.id)}
                              className="bg-red-600 text-white hover:text-red-700"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Transactions"
                              onClick={() => handleManageTransactions(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Admins"
                              onClick={() => handleManageAdmins(user.id)}
                              className="bg-purple-600 text-white hover:text-purple-700"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Send Message"
                              onClick={() => handleSendMessage(user.id)}
                              className="bg-orange-600 text-white hover:text-orange-700"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Edit Profile"
                              onClick={() => handleEditProfile(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        ) : user.kyc === "approved" && user.status === "restricted" ? (
                          <>
                            <Button
                              variant="ghost"
                              title="Activate User"
                              onClick={() => handleActivateUser(user.id)}
                              className="bg-green-600 text-white hover:text-green-700"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Transactions"
                              onClick={() => handleManageTransactions(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Manage Admins"
                              onClick={() => handleManageAdmins(user.id)}
                              className="bg-purple-600 text-white hover:text-purple-700"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Send Message"
                              onClick={() => handleSendMessage(user.id)}
                              className="bg-orange-600 text-white hover:text-orange-700"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              title="Edit Profile"
                              onClick={() => handleEditProfile(user.id)}
                              className="bg-blue-600 text-white hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddModal && <AddUserModal open={showAddModal} onOpenChange={setShowAddModal} Users={[]} />}
      {showEditModal && selectedUser && (
        <EditUserModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          user={selectedUser}
        />
      )}
      {showKycModal && selectedUser && (
        <KycModal
          open={showKycModal}
          onOpenChange={setShowKycModal}
          user={selectedUser}
          onKycUpdate={handleKycUpdate}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showActivateModal && selectedUser && (
        <ActivateUserModal
          open={showActivateModal}
          onOpenChange={setShowActivateModal}
          user={selectedUser}
          onActivate={handleUserStatusChange}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showRestrictModal && selectedUser && (
        <RestrictUserModal
          open={showRestrictModal}
          onOpenChange={setShowRestrictModal}
          user={selectedUser}
          onActivate={handleUserStatusChange}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {showManageAdminsModal && selectedUser && (
        <ManageAdminsModal
          open={showManageAdminsModal}
          onOpenChange={setShowManageAdminsModal}
          user={selectedUser}
          adminsList={adminsList}
          onAdminsUpdate={() => {
            setSelectedUser(null); // Refresh user data
            setShowManageAdminsModal(false);
          }}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {showUserMessageModal && (
        <UserMessageModal
          open={showUserMessageModal}
          onOpenChange={setShowUserMessageModal}
          userName={UserToMessage}
        />
      )}
    </div>
  );
}