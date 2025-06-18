import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { User } from '@/lib/types';

// Static list of Nigerian banks (replace with API if needed)
const nigerianBanks = [
  "Access Bank", "First Bank", "Guaranty Trust Bank", "Zenith Bank", "Wema Bank",
  "United Bank for Africa", "Ecobank", "Fidelity Bank", "Stanbic IBTC", "Sterling Bank",
];

interface KycModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onKycUpdate: () => void; // Callback to refresh user data after KYC update
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function KycModal({ open, onOpenChange, user, onKycUpdate, loading, setLoading }: KycModalProps) {
  const [kycForm, setKycForm] = useState<{
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    state: string;
    lga: string;
    streetAddress: string;
    bankName: string;
    accountNumber: string;
    accountDetails: null | { accountName: string; bankName: string; accountNumber: string };
  }>({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    state: "",
    lga: "",
    streetAddress: "",
    bankName: "",
    accountNumber: "",
    accountDetails: null,
  });

  // Pre-fill form with user data when modal opens
  useEffect(() => {
    if (user) {
      setKycForm({
        email: user.email || "",
        phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ")[1] || "",
        state: user.state || "",
        lga: user.lga || "",
        streetAddress: user.streetAddress || "",
        bankName: "",
        accountNumber: "",
        accountDetails: null,
      });
    }
  }, [user]);

  const handleKycAccountVerification = () => {
    if (!kycForm.accountNumber || kycForm.accountNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit account number.");
      return;
    }
    setLoading(true);
    // Simulate account verification (replace with API call)
    setTimeout(() => {
      const mockDetails = {
        accountName: `${kycForm.firstName} ${kycForm.lastName}`,
        bankName: kycForm.bankName,
        accountNumber: kycForm.accountNumber,
      };
      setKycForm((prev) => ({ ...prev, accountDetails: mockDetails }));
      toast.success("Account verified successfully!");
      setLoading(false);
    }, 1000); // Simulate API delay
  };

  const handleAcceptKYC = async () => {
    if (!kycForm.accountDetails) {
      toast.error("Please verify the account first.");
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "users", user?.id || "");
      await updateDoc(userRef, {
        kyc: "approved",
        status: "pending", // Move to pending activation after KYC approval
      });
      toast.success("KYC accepted. User awaiting activation.");
      onOpenChange(false);
      onKycUpdate();
    } catch (error) {
      console.error("Error accepting KYC:", error);
      toast.error("Failed to accept KYC.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectKYC = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", user?.id || "");
      await updateDoc(userRef, {
        kyc: "rejected",
      });
      toast.error("KYC rejected.");
      onOpenChange(false);
      onKycUpdate();
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finish KYC</DialogTitle>
          <DialogDescription>Complete the KYC process for {user?.name}.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleKycAccountVerification();
          }}
          className="grid gap-4 py-4"
        >
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={kycForm.email}
              onChange={(e) => setKycForm({ ...kycForm, email: e.target.value })}
              disabled
            />
          </div>

          <div className="flex gap-4 items-center">
            <span className="text-gray-600">+234</span>
            <div className="flex-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={kycForm.phoneNumber.replace("+234", "")}
                onChange={(e) =>
                  setKycForm({
                    ...kycForm,
                    phoneNumber: `+234${e.target.value}`,
                  })
                }
                disabled
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={kycForm.firstName}
                onChange={(e) => setKycForm({ ...kycForm, firstName: e.target.value })}
                disabled
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={kycForm.lastName}
                onChange={(e) => setKycForm({ ...kycForm, lastName: e.target.value })}
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={kycForm.state}
              onChange={(e) => setKycForm({ ...kycForm, state: e.target.value })}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="lga">City</Label>
            <Input
              id="lga"
              value={kycForm.lga}
              onChange={(e) => setKycForm({ ...kycForm, lga: e.target.value })}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={kycForm.streetAddress}
              onChange={(e) => setKycForm({ ...kycForm, streetAddress: e.target.value })}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Select
              onValueChange={(value) => setKycForm({ ...kycForm, bankName: value })}
              value={kycForm.bankName}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Banks</SelectLabel>
                  {nigerianBanks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={kycForm.accountNumber}
              onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
              placeholder="Enter 10-digit account number"
            />
          </div>

          {kycForm.accountDetails && (
            <div className="p-4 bg-gray-100 rounded-md">
              <p><strong>Account Name:</strong> {kycForm.accountDetails.accountName}</p>
              <p><strong>Bank Name:</strong> {kycForm.accountDetails.bankName}</p>
              <p><strong>Account Number:</strong> {kycForm.accountDetails.accountNumber}</p>
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>
        {kycForm.accountDetails && (
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAcceptKYC}
              disabled={loading}
            >
              Accept KYC
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectKYC}
              disabled={loading}
            >
              Reject KYC
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}