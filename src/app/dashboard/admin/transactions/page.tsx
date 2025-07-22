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
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan, Transaction, User, Permission } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AdminContext";
import { useBranchRole } from "@/context/BranchRoleContext";
import { getRoleName } from "@/lib/utils";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactionCategoryFilter, setTransactionCategoryFilter] = useState<
    "all" | "deposit" | "withdraw"
  >("all");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<
    "all" | "pending" | "approved" | "declined"
  >("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [roleType, setRoleType] = useState<"General" | "Branch" | "Assigned">(
    "General"
  );

  const { admin, permissions } = useAuth();
  const { roles } = useBranchRole();
  const role = getRoleName(admin?.role ?? "", roles);

  // Check permissions
  const hasPermission = (permission: Permission) =>
    permissions.includes("all") || permissions.includes(permission);

  // Fetch role type for Assigned role filtering
  useEffect(() => {
    if (admin?.role) {
      const roleRef = doc(db, "roles", admin.role);
      const unsubscribe = onSnapshot(
        roleRef,
        (doc) => {
          if (doc.exists()) {
            setRoleType(doc.data().roleType || "General");
          }
        },
        (error) => {
          console.error("Error fetching role type:", error);
          toast.error("Failed to load role type.");
        }
      );
      return () => unsubscribe();
    }
  }, [admin?.role]);

  // Fetch all users to map transaction user IDs and filter by branch/assigned
  useEffect(() => {
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

    const unsubscribeUsers = onSnapshot(
      q,
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as User[];
        setUsers(usersData);
      },
      (error) => {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    );
    return () => unsubscribeUsers();
  }, [admin?.branch, admin?.uid, roleType, permissions]);

  // Fetch plans
  useEffect(() => {
    const unsubscribePlans = onSnapshot(
      collection(db, "plans"),
      (snapshot) => {
        const plansData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Plan[];
        setPlans(plansData);
      },
      (error) => {
        console.error("Error fetching plans:", error);
        toast.error("Failed to load plans.");
      }
    );
    return () => unsubscribePlans();
  }, []);

  // Fetch transactions for allowed users
  useEffect(() => {
    setLoading(true);
    const unsubscribeTransactions: (() => void)[] = [];

    const fetchTransactions = async () => {
      try {
        const transactionsData: Transaction[] = [];
        for (const user of users) {
          const userTransactionQuery = query(
            collection(db, "users", user.id, "transactions")
          );
          const unsubscribe = onSnapshot(
            userTransactionQuery,
            (snapshot) => {
              const userTransactions = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                userId: user.id,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
              })) as Transaction[];
              setTransactions((prev) => {
                const otherTransactions = prev.filter(
                  (t) => t.userId !== user.id
                );
                return [...otherTransactions, ...userTransactions];
              });
            },
            (error) => {
              console.error(
                `Error fetching transactions for user ${user.id}:`,
                error
              );
              toast.error(`Failed to load transactions for user ${user.name}.`);
            }
          );
          unsubscribeTransactions.push(unsubscribe);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error setting up transaction listeners:", error);
        toast.error("Failed to load transactions.");
        setLoading(false);
      }
    };

    if (users.length > 0) {
      fetchTransactions();
    } else {
      setLoading(false);
    }

    return () => unsubscribeTransactions.forEach((unsub) => unsub());
  }, [users]);

  // Get plan name
  const getPlanName = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  // Get user name
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((trans) => {
      const transType = trans.transactionType.toLowerCase();
      const matchesCategory =
        transactionCategoryFilter === "all" ||
        transType === transactionCategoryFilter;
      const matchesStatus =
        transactionStatusFilter === "all" ||
        trans.status === transactionStatusFilter;
      const matchesPlan = planFilter === "all" || trans.planId === planFilter;
      return matchesCategory && matchesStatus && matchesPlan;
    });
  }, [
    transactions,
    transactionCategoryFilter,
    transactionStatusFilter,
    planFilter,
  ]);

  const handleApproveTransaction = async (
    userId: string,
    transactionId: string
  ) => {
    if (!userId || !transactionId) {
      toast.error("Invalid transaction data.");
      return;
    }
    const transaction = transactions.find(
      (t) => t.id === transactionId && t.userId === userId
    );
    if (!transaction) {
      toast.error("Transaction not found.");
      return;
    }
    const requiredPermission =
      transaction.transactionType === "deposit"
        ? "Approve/Reject Deposit"
        : "Approve/Reject Withdrawal";
    if (!hasPermission(requiredPermission)) {
      toast.error(
        `You do not have permission to approve ${transaction.transactionType}s.`
      );
      return;
    }
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
    if (!userId || !transactionId) {
      toast.error("Invalid transaction data.");
      return;
    }
    const transaction = transactions.find(
      (t) => t.id === transactionId && t.userId === userId
    );
    if (!transaction) {
      toast.error("Transaction not found.");
      return;
    }
    const requiredPermission =
      transaction.transactionType === "deposit"
        ? "Approve/Reject Deposit"
        : "Approve/Reject Withdrawal";
    if (!hasPermission(requiredPermission)) {
      toast.error(
        `You do not have permission to decline ${transaction.transactionType}s.`
      );
      return;
    }
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

  // Render action buttons based on permissions
  const renderActionButtons = (trans: Transaction) => {
    if (trans.status !== "pending") {
      return <div className="text-gray-500">N/A</div>;
    }
    const requiredPermission =
      trans.transactionType === "deposit"
        ? "Approve/Reject Deposit"
        : "Approve/Reject Withdrawal";
    if (!hasPermission(requiredPermission)) {
      return <div className="text-gray-500">N/A</div>;
    }
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => handleApproveTransaction(trans.userId ?? "", trans.id)}
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
          onClick={() => handleDeclineTransaction(trans.userId ?? "", trans.id)}
          className="bg-red-600 text-white hover:text-red-700"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <ProtectedRoute requiredPermission="View Transactions">
      <div className="flex flex-col gap-8 p-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">
              Transactions
            </h1>
            <p className="text-gray-600 m-0">
              View and manage all transactions across authorized users.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-end gap-4 mb-6">
              <Select
                onValueChange={(value) =>
                  setTransactionCategoryFilter(
                    value as "all" | "deposit" | "withdraw"
                  )
                }
                value={transactionCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdraw">Withdrawals</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setTransactionStatusFilter(
                    value as "all" | "pending" | "approved" | "declined"
                  )
                }
                value={transactionStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setPlanFilter(value)}
                value={planFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading Transactions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-gray-500"
                    >
                      No transactions match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((trans, id) => (
                    <TableRow key={trans.id}>
                      <TableCell>{id + 1}</TableCell>
                      <TableCell>{getUserName(trans.userId ?? "")}</TableCell>
                      <TableCell className="capitalize">
                        {trans.transactionType}
                      </TableCell>
                      <TableCell>{getPlanName(trans.planId)}</TableCell>
                      <TableCell>₦{trans.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className="capitalize">{trans.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {trans.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{renderActionButtons(trans)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
