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
  Edit,
  Loader2,
  Plus,
  Search,
  MessageSquare,
  Users,
  DollarSign,
  Lock,
  BadgeCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Admin, Branch, Plan, Transaction, User, UserPlan } from "@/lib/types";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Reusable PlanSelect component
const PlanSelect = ({
  plans,
  value,
  onValueChange,
  placeholder,
  disabled,
}: {
  plans: { id: string; name: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) => (
  <Select onValueChange={onValueChange} value={value} disabled={disabled}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {plans.length === 0 ? (
        <SelectItem value="no value" disabled>
          No plans available
        </SelectItem>
      ) : (
        plans.map((plan) => (
          <SelectItem key={plan.id} value={plan.id}>
            {plan.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
);

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
  const [showUserMessageModal, setShowUserMessageModal] = useState(false);
  const [showManageTransactionsModal, setShowManageTransactionsModal] =
    useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [assignedPlans, setAssignedPlans] = useState<UserPlan[]>([]);
  const [assignedPlanId, setAssignedPlanId] = useState<string>("");
  const [amount, setAmount] = useState<number>();
  const [transactionType, setTransactionType] = useState<
    "withdraw" | "deposit"
  >();
  const [transactionCategoryFilter, setTransactionCategoryFilter] = useState<
    "all" | "deposits" | "withdrawals"
  >("all");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<
    "all" | "pending" | "approved" | "declined"
  >("all");

  // Fetch users
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

  // Fetch admins
  useEffect(() => {
    setLoading(true);
    const unsubscribeAdmins = onSnapshot(
      collection(db, "admins"),
      (snapshot) => {
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

  // Fetch plans
  useEffect(() => {
    const unsubscribePlans = onSnapshot(collection(db, "plans"), (snapshot) => {
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Plan[];
      setPlans(plansData);
      setLoading(false);
    });
    return () => unsubscribePlans();
  }, []);

  // Fetch assigned plans for the selected user
  useEffect(() => {
    if (selectedUser) {
      const unsubscribeAssignedPlans = onSnapshot(
        collection(db, "users", selectedUser.id, "userPlans"),
        (snapshot) => {
          const assignedPlansData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as UserPlan[];
          setAssignedPlans(assignedPlansData);
        }
      );
      return () => unsubscribeAssignedPlans();
    }
  }, [selectedUser]);

  // Fetch transactions for the selected user
  useEffect(() => {
    if (selectedUser) {
      const unsubscribeTransactions = onSnapshot(
        collection(db, "users", selectedUser.id, "transactions"),
        (snapshot) => {
          const transactionData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as Transaction[];
          setTransactions(transactionData);
        }
      );
      return () => unsubscribeTransactions();
    }
  }, [selectedUser]);

  // Get assigned plan name
  const getAssignedPlanName = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  // Memoized filtered users
  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  // Get branch name
  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  // Memoized filtered transactions
  const filteredTransactions = useMemo(
    () =>
      transactions?.filter((trans) => {
        const matchesCategory =
          transactionCategoryFilter === "all" ||
          trans.transactionType.toLowerCase() ===
            transactionCategoryFilter.slice(0, -1);
        const matchesStatus =
          transactionStatusFilter === "all" ||
          trans.status === transactionStatusFilter;
        return matchesCategory && matchesStatus;
      }) || [],
    [transactions, transactionCategoryFilter, transactionStatusFilter]
  );

  // Calculate plan balance
  const getPlanBalance = (planId: string) => {
    if (!transactions) return 0;
    return transactions
      .filter((trans) => trans.planId === planId && trans.status === "approved")
      .reduce((balance, trans) => {
        return trans.transactionType === "deposit"
          ? balance + trans.amount
          : balance - trans.amount;
      }, 0);
  };

  const handleUserStatusChange = async (
    userId: string,
    newStatus: "active" | "restricted"
  ) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { status: newStatus });
      toast.success(
        `User ${newStatus === "active" ? "activated" : "restricted"} successfully!`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    } finally {
      setLoading(false);
      setShowActivateModal(false);
      setShowRestrictModal(false);
    }
  };

  const handleActivateUser = (userId: string) => {
    const userToActivate = users.find((u) => u.id === userId);
    if (userToActivate) {
      if (userToActivate.admins === 0 || !userToActivate.admins) {
        setTimeout(() => {
          toast.info("Please click 'Manage Admins' to assign an admin.");
        }, 2000);
        toast.error(
          "Citygates Food Bank: Please assign at least one admin to user before activating!"
        );
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
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setShowManageTransactionsModal(true);
    } else {
      toast.error("User not found.");
    }
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
    const userToMessage = users.find((u) => u.id === userId);
    if (userToMessage) {
      setUserToMessage(userToMessage.name);
      setShowUserMessageModal(true);
    } else {
      toast.error("User not found.");
    }
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

  const handleRestrictUser = (userId: string) => {
    const userToRestrict = users.find((u) => u.id === userId);
    if (userToRestrict) {
      setSelectedUser(userToRestrict);
      setShowRestrictModal(true);
    } else {
      toast.error("User not found.");
    }
  };

  const handleKycUpdate = () => {
    setSelectedUser(null);
    setShowKycModal(false);
  };

  const handleSubscribeUser = async () => {
    if (!selectedUser || !selectedPlanId) {
      toast.error("Please select a plan to subscribe.");
      return;
    }
    if (assignedPlans.some((plan) => plan.planId === selectedPlanId)) {
      toast.error("This plan is already assigned to the user.");
      return;
    }
    setLoading(true);
    try {
      const userPlanRef = doc(
        collection(db, "users", selectedUser.id, "userPlans")
      );
      await setDoc(userPlanRef, {
        planId: selectedPlanId,
        status: "pending",
        startDate: new Date(),
        endDate: null,
        createdAt: serverTimestamp(),
      });
      toast.success("User subscribed to plan successfully! Awaiting approval.");
      setShowSubscribeModal(false);
      setSelectedPlanId("");
    } catch (error) {
      console.error("Error subscribing user to plan:", error);
      toast.error("Failed to subscribe user to plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserTransaction = async (type: "withdraw" | "deposit") => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const processUserTransaction = async () => {
    if (
      !selectedUser ||
      !selectedPlanId ||
      amount === undefined ||
      amount <= 0 ||
      isNaN(amount)
    ) {
      toast.error(
        "Please select a plan and enter a valid amount greater than 0."
      );
      return;
    }
    setLoading(true);
    try {
      const userTransactionRef = doc(
        collection(db, "users", selectedUser.id, "transactions")
      );
      await setDoc(userTransactionRef, {
        planId: selectedPlanId, // Store the Plan ID
        transactionType: transactionType,
        amount: amount,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success(
        `User ${transactionType} of ₦${amount.toLocaleString()} submitted successfully! Awaiting approval.`
      );
      setShowTransactionModal(false);
      setSelectedPlanId("");
      setAmount(undefined);
      setTransactionType(undefined);
    } catch (error) {
      console.error(`Error completing user ${transactionType}:`, error);
      toast.error(`Failed to process ${transactionType}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransaction = async (
    userId: string,
    transactionId: string
  ) => {
    setLoading(true);
    try {
      const userTransactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );
      await updateDoc(userTransactionRef, {
        status: "approved",
        updatedAt: serverTimestamp(),
      });
      toast.success("Transaction approved successfully!");
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Failed to approve transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineTransaction = async (
    userId: string,
    transactionId: string
  ) => {
    setLoading(true);
    try {
      const userTransactionRef = doc(
        db,
        "users",
        userId,
        "transactions",
        transactionId
      );
      await updateDoc(userTransactionRef, {
        status: "declined",
        updatedAt: serverTimestamp(),
      });
      toast.success("Transaction declined successfully!");
    } catch (error) {
      console.error("Error declining transaction:", error);
      toast.error("Failed to decline transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">
            Users
          </h1>
          <p className="text-gray-600 m-0">
            Manage your users here. You can view, edit, and delete users
            information.
          </p>
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
                    <TableCell className="w-1/8">
                      {getBranchName(user.branch ?? "")}
                    </TableCell>
                    <TableCell className="w-1/8">
                      <Badge className="capitalize">{user.status}</Badge>
                    </TableCell>
                    <TableCell className="w-1/8">
                      <Badge className="capitalize">{user.kyc}</Badge>
                    </TableCell>
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
                        ) : user.kyc === "approved" &&
                          user.status === "pending" ? (
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
                        ) : user.kyc === "approved" &&
                          user.status === "active" ? (
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
                        ) : user.kyc === "approved" &&
                          user.status === "restricted" ? (
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

      {showAddModal && (
        <AddUserModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          Users={[]}
        />
      )}
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
            setSelectedUser(null);
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
      {showManageTransactionsModal && selectedUser && (
        <Dialog
          open={showManageTransactionsModal}
          onOpenChange={() => {
            setShowManageTransactionsModal(false);
            setAssignedPlanId("");
          }}
        >
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Manage Transactions for {selectedUser.name}
              </DialogTitle>
              <DialogDescription>
                View or manage the active plans and transactions for this user.
              </DialogDescription>
            </DialogHeader>
            {assignedPlans && assignedPlans.length > 0 ? (
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    className="bg-green-300 text-black hover:bg-green-400 rounded-4xl"
                    onClick={() => handleUserTransaction("deposit")}
                  >
                    <DollarSign className="h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    className="bg-blue-300 text-black hover:bg-blue-400 rounded-4xl"
                    onClick={() => handleUserTransaction("withdraw")}
                  >
                    <DollarSign className="h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
                {/* category filter */}
                <div className="flex justify-end gap-4">
                  {/* Transactions category */}
                  <Select
                    onValueChange={(value) =>
                      setTransactionCategoryFilter(
                        value as "all" | "deposits" | "withdrawals"
                      )
                    }
                    value={transactionCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px] mt-4">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="deposits">Deposits</SelectItem>
                      <SelectItem value="withdrawals">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Status filtering */}
                  <Select
                    onValueChange={(value) =>
                      setTransactionStatusFilter(
                        value as "all" | "pending" | "approved" | "declined"
                      )
                    }
                    value={transactionStatusFilter}
                  >
                    <SelectTrigger className="w-[180px] mt-4">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
            <div className="py-4">
              {assignedPlans && assignedPlans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S/N</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((trans, id) => (
                        <TableRow key={trans.id}>
                          <TableCell>{id + 1}</TableCell>
                          <TableCell className="capitalize">
                            {trans.transactionType}
                          </TableCell>
                          <TableCell>
                            {getAssignedPlanName(trans.planId)}
                          </TableCell>
                          <TableCell>
                            ₦{trans.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="capitalize">{trans.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {trans.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    handleApproveTransaction(
                                      selectedUser.id,
                                      trans.id
                                    )
                                  }
                                  aria-label="Approve transaction"
                                  title="Approve"
                                  className="bg-green-600 text-white hover:text-green-700"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  aria-label="Decline transaction"
                                  title="Decline"
                                  onClick={() =>
                                    handleDeclineTransaction(
                                      selectedUser.id,
                                      trans.id
                                    )
                                  }
                                  className="bg-red-600 text-white hover:text-red-700"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500"
                        >
                          No transactions match the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">No active plan yet.</p>
              )}
            </div>
            <DialogFooter className="flex items-center justify-between">
              <div className="py-4 space-y-4 w-full">
                <PlanSelect
                  plans={plans}
                  value={assignedPlanId}
                  onValueChange={setAssignedPlanId}
                  placeholder="Select Plan"
                  disabled={plans.length === 0}
                />
              </div>
              <Button
                onClick={() => setShowSubscribeModal(true)}
                disabled={plans.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showSubscribeModal && selectedUser && (
        <Dialog open={showSubscribeModal} onOpenChange={setShowSubscribeModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Subscribe User</DialogTitle>
              <DialogDescription>
                Select a plan to subscribe {selectedUser.name} to.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 w-full">
              <PlanSelect
                plans={plans}
                value={selectedPlanId}
                onValueChange={setSelectedPlanId}
                placeholder="Select Plan"
                disabled={plans.length === 0}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubscribeUser}
                disabled={loading || !selectedPlanId}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showTransactionModal && selectedUser && (
        <Dialog
          open={showTransactionModal}
          onOpenChange={() => {
            setShowTransactionModal(false);
            setSelectedPlanId("");
            setAmount(undefined);
            setTransactionType(undefined);
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {transactionType} Funds
              </DialogTitle>
              <DialogDescription>
                You are making a {transactionType} for {selectedUser.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4 w-full">
              <div className="space-y-1">
                <Label>Select Plan</Label>
                <PlanSelect
                  plans={assignedPlans.map((plan) => ({
                    id: plan.planId,
                    name: getAssignedPlanName(plan.planId),
                  }))}
                  value={selectedPlanId}
                  onValueChange={setSelectedPlanId}
                  placeholder="Select Plan"
                  disabled={assignedPlans.length === 0}
                />
                <p>
                  Balance: ₦{getPlanBalance(selectedPlanId).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <Label>Amount to {transactionType}</Label>
                <Input
                  placeholder="Enter amount in Naira"
                  type="number"
                  value={amount ?? ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="capitalize"
                onClick={processUserTransaction}
                disabled={
                  loading ||
                  !selectedPlanId ||
                  amount === undefined ||
                  amount <= 0 ||
                  isNaN(amount)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {transactionType}ing...
                  </>
                ) : (
                  `${transactionType}`
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
