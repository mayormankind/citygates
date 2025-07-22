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
import {
  Lock,
  MessageSquare,
  Edit,
  Loader2,
  Plus,
  Search,
  ThumbsUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Admin, Branch, Permission, Role } from "@/lib/types"; // Added Role type
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateAdminModal from "@/components/modals/add-admin-modal";
import AdminResetPassword from "@/components/modals/admin-password-reset-modal";
import AdminMessageModal from "@/components/modals/admin-message-modal";
import ActivateAdminModal from "@/components/modals/activateAdminModal";
import RestrictAdminModal from "@/components/modals/restictAdminModal";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/context/AdminContext";

export default function ManageAdminsPage() {
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [AdminToMessage, setAdminToMessage] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [adminMessageModal, setAdminMessageModal] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string | null>(
    null
  );
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const { admin, permissions } = useAuth();
  const [roleType, setRoleType] = useState<"General" | "Branch" | "Assigned">(
    "General"
  );

  const hasPermission = (permission: Permission) =>
    permissions.includes("all") || permissions.includes(permission);

  useEffect(() => {
    if (admin?.role) {
      const roleRef = doc(db, "roles", admin.role);
      const unsubscribe = onSnapshot(roleRef, (doc) => {
        if (doc.exists()) {
          setRoleType(doc.data().roleType || "General");
        }
      });
      return () => unsubscribe();
    }
  }, [admin?.role]);

  // Fetch admins
  useEffect(() => {
    setLoadingAdmins(true);
    const q = hasPermission("all")
      ? collection(db, "admins")
      : roleType === "Branch"
        ? query(
            collection(db, "admins"),
            where("branch", "==", admin?.branch ?? "")
          )
        : collection(db, "admins");
    const unsubscribeAdmins = onSnapshot(
      q,
      (snapshot) => {
        const adminsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Admin[];
        setAdmins(adminsData);
        setLoadingAdmins(false);
      },
      (error) => {
        console.error("Error fetching admins:", error);
        toast.error("Failed to load admins.");
        setLoadingAdmins(false);
      }
    );
    return () => unsubscribeAdmins();
  }, [admin?.branch, roleType, permissions]);

  // Fetch branches
  useEffect(() => {
    setLoadingBranches(true);
    const unsubscribeBranches = onSnapshot(
      collection(db, "branches"),
      (snapshot) => {
        const branchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Branch[];
        setBranches(branchesData);
        setLoadingBranches(false);
      },
      (error) => {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches.");
        setLoadingBranches(false);
      }
    );
    return () => unsubscribeBranches();
  }, []);

  // Fetch roles
  useEffect(() => {
    setLoadingRoles(true);
    const unsubscribeRoles = onSnapshot(
      collection(db, "roles"),
      (snapshot) => {
        const rolesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          permissions: doc.data().permissions || [],
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Role[];
        setRoles(rolesData);
        setLoadingRoles(false);
      },
      (error) => {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles.");
        setLoadingRoles(false);
      }
    );
    return () => unsubscribeRoles();
  }, []);

  // Filter admins by search term and selected branch
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(admin.phoneNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesBranch =
      selectedBranch === "all" || admin.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  // Map branch and role IDs to names
  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  const handleChangePassword = (adminId: string) => {
    if (!hasPermission("Change Password")) {
      toast.error("You do not have permission to change passwords.");
      return;
    }
    const admin = admins.find((a) => a.id === adminId);
    if (admin && admin.email) {
      setSelectedAdminEmail(admin.email);
      setShowResetPasswordModal(true);
    } else {
      toast.error("Admin not found or email missing.");
    }
  };

  const handleAdminStatusChange = async (
    adminId: string,
    newStatus: "active" | "restricted"
  ) => {
    if (!hasPermission("Activate/Deactivate Admin")) {
      toast.error("You do not have permission to change admin status.");
      return;
    }
    setLoadingAdmins(true);
    try {
      const userRef = doc(db, "admins", adminId);
      setShowActivateModal(false);
      setShowRestrictModal(false);
      await updateDoc(userRef, { status: newStatus });
      toast.success(
        `Admin ${newStatus === "active" ? "activated" : newStatus} successfully!`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleActivateAdmin = (adminId: string) => {
    const adminToActivate = admins.find((u) => u.id === adminId);
    if (adminToActivate) {
      setSelectedAdmin(adminToActivate);
      setShowActivateModal(true);
    }
  };

  const handleRestrictAdmin = (adminId: string) => {
    const adminToActivate = admins.find((u) => u.id === adminId);
    if (adminToActivate) {
      setSelectedAdmin(adminToActivate);
      setShowRestrictModal(true);
    }
  };

  const handleSendMessage = (adminEmail: string) => {
    if (!hasPermission("Send Message")) {
      toast.error("You do not have permission to send messages.");
      return;
    }
    setAdminMessageModal(true);
    setAdminToMessage(adminEmail);
  };

  const handlePasswordChanged = () => {
    setShowResetPasswordModal(false);
    setSelectedAdminEmail(null);
  };

  return (
    <ProtectedRoute requiredPermission="View Admins">
      <div className="flex flex-col gap-8 p-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">
              Manage Admins
            </h1>
            <p className="text-gray-600 m-0">
              Manage your admin accounts here.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowCreateAdminModal(true)}
              disabled={!hasPermission("Create Admins")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by email or name or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  onValueChange={(value) => setSelectedBranch(value)}
                  value={selectedBranch}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      <SelectItem value="all">All Branches</SelectItem>
                      {loadingBranches ? (
                        <div className="p-2 text-sm text-gray-500">
                          <Loader2 className="w-6 h-6 animate-spin" /> Loading
                          branches...
                        </div>
                      ) : branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          No branches available
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12">S/N</TableHead>
                  <TableHead className="w-3/12">Email</TableHead>
                  <TableHead className="w-2/12">Phone Number</TableHead>
                  <TableHead className="w-2/12">Branch</TableHead>
                  <TableHead className="w-2/12">Role</TableHead>
                  <TableHead className="w-2/12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingAdmins ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading Admins...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No admins available. Please add an admin.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin, index) => (
                    <TableRow key={admin.id}>
                      <TableCell className="w-1/12">{index + 1}</TableCell>
                      <TableCell className="w-3/12">{admin.email}</TableCell>
                      <TableCell className="w-2/12">
                        +234{admin.phoneNumber}
                      </TableCell>
                      <TableCell className="w-2/12">
                        {getBranchName(admin.branch)}
                      </TableCell>
                      <TableCell className="w-2/12">
                        {getRoleName(admin.role)}
                      </TableCell>
                      <TableCell className="w-2/12">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            title="Change Password"
                            onClick={() => handleChangePassword(admin.id)}
                            className="bg-purple-600 text-white hover:bg-purple-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {admin.status === "active" ? (
                            <Button
                              variant="ghost"
                              title="Restrict Admin"
                              onClick={() => handleRestrictAdmin(admin.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              title="Activate Admin"
                              onClick={() => handleActivateAdmin(admin.id)}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            title="Send Message"
                            onClick={() => handleSendMessage(admin.email)}
                            className="bg-orange-600 text-white hover:bg-orange-700"
                          >
                            <MessageSquare className="h-4 w-4" />
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

        {showCreateAdminModal && (
          <CreateAdminModal
            open={showCreateAdminModal}
            onOpenChange={setShowCreateAdminModal}
          />
        )}
        {showResetPasswordModal && selectedAdminEmail && (
          <AdminResetPassword
            open={showResetPasswordModal}
            onOpenChange={setShowResetPasswordModal}
            adminEmail={selectedAdminEmail}
            onPasswordChanged={handlePasswordChanged}
          />
        )}

        {adminMessageModal && (
          <AdminMessageModal
            open={adminMessageModal}
            onOpenChange={setAdminMessageModal}
            adminName={AdminToMessage}
          />
        )}

        {showActivateModal && selectedAdmin && (
          <ActivateAdminModal
            open={showActivateModal}
            onOpenChange={setShowActivateModal}
            admin={selectedAdmin}
            onActivate={handleAdminStatusChange}
            loading={loadingAdmins}
            setLoading={setLoadingAdmins}
          />
        )}

        {showRestrictModal && selectedAdmin && (
          <RestrictAdminModal
            open={showRestrictModal}
            onOpenChange={setShowRestrictModal}
            admin={selectedAdmin}
            onActivate={handleAdminStatusChange}
            loading={loadingAdmins}
            setLoading={setLoadingAdmins}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
