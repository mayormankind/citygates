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
import { Loader2, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDocs,
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
import { Plan, Transaction, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

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

  // Fetch all users to map transaction user IDs
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
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
  }, []);

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

  // Fetch all transactions from all users
  useEffect(() => {
    let allTransactions: Transaction[] = [];
    setLoading(true);

    const fetchTransactions = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const promises = usersSnapshot.docs.map(async (userDoc) => {
          const q = query(collection(db, "users", userDoc.id, "transactions"));
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            userId: userDoc.id,
          })) as Transaction[];
        });

        const results = await Promise.all(promises);
        allTransactions = results.flat();
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Real-time updates (optional, can be removed for performance if not needed)
    const unsubscribeTransactions = onSnapshot(
      query(collection(db, "users")),
      () => fetchTransactions(),
      (error) => {
        console.error("Real-time error:", error);
        toast.error("Error updating transactions.");
      }
    );

    return () => unsubscribeTransactions();
  }, []);

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
            Transactions
          </h1>
          <p className="text-gray-600 m-0">
            View and manage all transactions across all users.
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
                <SelectItem value="all">All</SelectItem>
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
                <SelectItem value="all">All</SelectItem>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Transactions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
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
                      {trans.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleApproveTransaction(
                                trans.userId ?? "",
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
                                trans.userId ?? "",
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
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
