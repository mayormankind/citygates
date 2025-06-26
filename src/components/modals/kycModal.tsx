// import React, { useState, useEffect, useMemo } from 'react';
// import { Button } from '../ui/button';
// import { Label } from '../ui/label';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
// import { Input } from '../ui/input';
// import { toast } from 'sonner';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
// import { Loader2 } from 'lucide-react';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';
// import { User } from '@/lib/types';
// import axios from 'axios';

// interface Bank {
//   name: string;
//   code?: string;
// }

// interface KycModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user: User | null;
//   onKycUpdate: () => void; // Callback to refresh user data after KYC update
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// export default function KycModal({ open, onOpenChange, user, onKycUpdate, loading, setLoading }: KycModalProps) {
//   const [kycForm, setKycForm] = useState<{
//     email: string;
//     phoneNumber: string;
//     firstName: string;
//     lastName: string;
//     state: string;
//     lga: string;
//     streetAddress: string;
//     bankName: string;
//     accountNumber: string;
//     accountDetails: null | { accountName: string; bankName: string; accountNumber: string };
//   }>({
//     email: "",
//     phoneNumber: "",
//     firstName: "",
//     lastName: "",
//     state: "",
//     lga: "",
//     streetAddress: "",
//     bankName: "",
//     accountNumber: "",
//     accountDetails: null,
//   });

//   const [ nigerianBanks, setNigerianBanks ] = useState<any>([])
//   const [bankFetchError, setBankFetchError] = useState(false);

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axios.get('https://nubapi.com/bank-json', {
//           headers: { 
//             'Content-Type': 'application/json',
//           },
//         });
//         // Validate response structure
//         if (Array.isArray(response.data) && response.data.every((b: any) => typeof b.name === 'string')) {
//           //sort bank alphabetically
//           const sortedBanks = response.data.sort((a: Bank, b: Bank) =>
//             a.name.localeCompare(b.name)
//           );
//           setNigerianBanks(sortedBanks);
//         } else {
//           throw new Error('Invalid bank data format');
//         }
//       } catch (error) {
//         console.error('Error fetching banks:', error);
//         toast.error('Failed to load bank list. Please try again.');
//         setBankFetchError(true);
//       }
//     };
//     fetchBanks();
//   }, []);

//   // Pre-fill form with user data when modal opens
//   useEffect(() => {
//     if (user) {
//       setKycForm({
//         email: user.email || "",
//         phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
//         firstName: user.name.split(" ")[0] || "",
//         lastName: user.name.split(" ")[1] || "",
//         state: user.state || "",
//         lga: user.lga || "",
//         streetAddress: user.streetAddress || "",
//         bankName: "",
//         accountNumber: "",
//         accountDetails: null,
//       });
//     }
//   }, [user]);

//   const handleKycAccountVerification = async(e:React.FormEvent) => {
//     e.preventDefault();
//     if (!kycForm.accountNumber || kycForm.accountNumber.length !== 10 || !/^\d{10}$/.test(kycForm.accountNumber)) {
//       toast.error("Please enter a valid 10-digit account number.");
//       return;
//     }
//     if (!kycForm.bankName) {
//       toast.error('Please select a bank.');
//       return;
//     }
//     setLoading(true);
//     console.log(kycForm)

//     try {
//       const response = await axios.get(
//         `https://nubapi.com/api/verify?account_number=${kycForm.accountNumber}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       const data = response.data;
//       if (data.accountName && data.bankName && data.accountNumber) {
//         setKycForm((prev) => ({ ...prev, accountDetails: data }));
//         toast.success('Account verified successfully!');
//       } else {
//         throw new Error('Invalid account details');
//       }
//     } catch (error) {
//       console.error('Error verifying account:', error);
//       toast.error('Failed to verify account. Please check the details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAcceptKYC = async () => {
//     if (!kycForm.accountDetails) {
//       toast.error("Please verify the account first.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const userRef = doc(db, "users", user?.id || "");
//       await updateDoc(userRef, {
//         kyc: "approved",
//         status: "pending",
//         bankName: kycForm.accountDetails.bankName,
//         accountNumber: kycForm.accountDetails.accountNumber,
//         accountName: kycForm.accountDetails.accountName,
//       });
//       toast.success("KYC accepted. User awaiting activation.");
//       onOpenChange(false);
//       onKycUpdate();
//     } catch (error) {
//       console.error("Error accepting KYC:", error);
//       toast.error("Failed to accept KYC.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRejectKYC = async () => {
//     setLoading(true);
//     try {
//       const userRef = doc(db, "users", user?.id || "");
//       await updateDoc(userRef, {
//         kyc: "rejected",
//       });
//       toast.error("KYC rejected.");
//       onOpenChange(false);
//       onKycUpdate();
//     } catch (error) {
//       console.error("Error rejecting KYC:", error);
//       toast.error("Failed to reject KYC.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const bankOptions = useMemo(() => nigerianBanks, [nigerianBanks]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Finish KYC</DialogTitle>
//           <DialogDescription>Complete the KYC process for {user?.name}.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleKycAccountVerification}className="grid gap-4 py-4">
//           <div>
//             <Label htmlFor="email">Email Address</Label>
//             <Input id="email"  value={kycForm.email} disabled/>
//           </div>

//           <div className="flex gap-4 items-center">
//             <span className="text-gray-600">+234</span>
//             <div className="flex-1">
//               <Label htmlFor="phoneNumber">Phone Number</Label>
//               <Input id="phoneNumber" value={kycForm.phoneNumber.replace(/^\+234/, '')} disabled />
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <div className="flex-1">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input id="firstName" value={kycForm.firstName} disabled />
//             </div>
//             <div className="flex-1">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input id="lastName" value={kycForm.lastName} disabled
//               />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="state">State</Label>
//             <Input id="state" value={kycForm.state} disabled
//             />
//           </div>

//           <div>
//             <Label htmlFor="lga">City</Label>
//             <Input id="lga" value={kycForm.lga} disabled />
//           </div>

//           <div>
//             <Label htmlFor="streetAddress">Street Address</Label>
//             <Input id="streetAddress" value={kycForm.streetAddress} disabled
//             />
//           </div>

//           <div>
//             <Label htmlFor="bankName">Bank Name</Label>
//             <Select
//               onValueChange={(value) => setKycForm({ ...kycForm, bankName: value })}
//               value={kycForm.bankName}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Bank" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Banks</SelectLabel>
//                     {bankOptions.length ? (
//                       bankOptions.map((bank:any) => (
//                         <SelectItem key={bank.name} value={bank.name}>
//                           {bank.name}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="none" disabled>
//                         {bankFetchError ? 'Failed to load banks' : 'Loading banks...'}
//                       </SelectItem>
//                     )}
//                   </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="accountNumber">Account Number</Label>
//             <Input
//               id="accountNumber"
//               value={kycForm.accountNumber}
//               onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
//               placeholder="Enter 10-digit account number"
//               maxLength={10}
//             />
//           </div>

//           {kycForm.accountDetails && (
//             <div className="p-4 bg-gray-100 rounded-md">
//               <p><strong>Account Name:</strong> {kycForm.accountDetails.accountName}</p>
//               <p><strong>Bank Name:</strong> {kycForm.accountDetails.bankName}</p>
//               <p><strong>Account Number:</strong> {kycForm.accountDetails.accountNumber}</p>
//             </div>
//           )}

//           <Button type="submit" disabled={loading || !kycForm.bankName || !kycForm.accountNumber || kycForm.accountNumber.length !== 10}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Verifying...
//               </>
//             ) : (
//               "Verify Account"
//             )}
//           </Button>
//         </form>
//         {kycForm.accountDetails && (
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
//             <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAcceptKYC} disabled={loading}>Accept KYC</Button>
//             <Button variant="destructive" onClick={handleRejectKYC} disabled={loading}
//             >Reject KYC</Button>
//           </DialogFooter>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { User } from '@/lib/types';
import axios from 'axios';
import { auth } from '@/lib/firebaseConfig'; // Assumes Firebase Auth is set up

interface Bank {
  name: string;
  code: string;
}

interface AccountDetails {
  account_name: string;
  Bank_name: string;
  account_number: string;
  bank_code: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  status: boolean;
}

interface KycForm {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  state: string;
  lga: string;
  streetAddress: string;
  bankName: string;
  accountDetails: AccountDetails | null;
}

interface KycModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onKycUpdate: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function KycModal({ open, onOpenChange, user, onKycUpdate, loading, setLoading }: KycModalProps) {
  const [kycForm, setKycForm] = useState<KycForm>({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    state: '',
    lga: '',
    streetAddress: '',
    bankName: '',
    accountDetails: null,
  });
  const [accountNumber, setAccountNumber] = useState('');
  const [nigerianBanks, setNigerianBanks] = useState<Bank[]>([]);
  const [bankFetchError, setBankFetchError] = useState(false);

  // Fetch Nigerian banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://nubapi.com/bank-json', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (Array.isArray(response.data) && response.data.every((b: any) => typeof b.name === 'string' && typeof b.code === 'string')) {
          // Sort banks alphabetically
          const sortedBanks = response.data.sort((a: Bank, b: Bank) =>
            a.name.localeCompare(b.name)
          );
          setNigerianBanks(sortedBanks);
        } else {
          throw new Error('Invalid bank data format');
        }
      } catch (error: any) {
        console.error('Error fetching banks:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        toast.error('Failed to load bank list. Please try again.');
        setBankFetchError(true);
      }
    };
    fetchBanks();
  }, []);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      const nameParts = user.name.trim().split(/\s+/);
      setKycForm({
        email: user.email || '',
        phoneNumber: user.phoneNumber ? String(user.phoneNumber) : '',
        firstName: nameParts[0] || '',
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        state: user.state || '',
        lga: user.lga || '',
        streetAddress: user.streetAddress || '',
        bankName: '',
        accountDetails: null,
      });
      setAccountNumber('');
    }
  }, [user]);

  const handleKycAccountVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length !== 10 || !/^\d{10}$/.test(accountNumber)) {
      toast.error('Please enter a valid 10-digit account number.');
      return;
    }
    if (!kycForm.bankName) {
      toast.error('Please select a bank.');
      return;
    }
    const bankCode = nigerianBanks.find((b) => b.name === kycForm.bankName)?.code;
    if (!bankCode) {
      toast.error('Selected bank is invalid.');
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get(
        `https://nubapi.com/api/verify?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN || 'missing-token'}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      if (data.status && data.account_name && data.Bank_name && data.account_number) {
        setKycForm((prev) => ({
          ...prev,
          accountDetails: {
            account_name: data.account_name,
            Bank_name: data.Bank_name,
            account_number: data.account_number,
            bank_code: data.bank_code,
            first_name: data.first_name,
            last_name: data.last_name,
            other_name: data.other_name,
            status: data.status,
          },
        }));
        toast.success('Account verified successfully!');
      } else {
        throw new Error('Invalid account details');
      }
    } catch (error: any) {
      console.error('Error verifying account:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || 'Failed to verify account. Please check the details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptKYC = async () => {
    if (!user?.id) {
      toast.error('Invalid user data.');
      return;
    }
    if (!kycForm.accountDetails) {
      toast.error('Please verify the account first.');
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        kyc: 'approved',
        status: 'pending',
        bankName: kycForm.accountDetails.Bank_name,
        accountNumber: kycForm.accountDetails.account_number,
        accountName: kycForm.accountDetails.account_name,
        // bankCode: kycForm.accountDetails.bank_code,
      });
      await addDoc(collection(db, 'kyc_audits'), {
        userId: user.id,
        action: 'approved',
        timestamp: serverTimestamp(),
        performedBy: auth.currentUser?.uid || 'unknown',
      });
      toast.success('KYC accepted. User awaiting activation.');
      onOpenChange(false);
      onKycUpdate();
    } catch (error: any) {
      console.error('Error accepting KYC:', error);
      toast.error('Failed to accept KYC.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectKYC = async () => {
    if (!user?.id) {
      toast.error('Invalid user data.');
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        kyc: 'rejected',
      });
      await addDoc(collection(db, 'kyc_audits'), {
        userId: user.id,
        action: 'rejected',
        timestamp: serverTimestamp(),
        performedBy: auth.currentUser?.uid || 'unknown',
      });
      toast.error('KYC rejected.');
      onOpenChange(false);
      onKycUpdate();
    } catch (error: any) {
      console.error('Error rejecting KYC:', error);
      toast.error('Failed to reject KYC.');
    } finally {
      setLoading(false);
    }
  };

  const bankOptions = useMemo(() => nigerianBanks, [nigerianBanks]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finish KYC</DialogTitle>
          <DialogDescription>Complete the KYC process for {user?.name || 'User'}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleKycAccountVerification} className="grid gap-3 py-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={kycForm.email} disabled />
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">+234</span>
            <div className="flex-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" value={kycForm.phoneNumber.replace(/^\+234/, '')} disabled />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={kycForm.firstName} disabled />
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={kycForm.lastName} disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={kycForm.state} disabled />
          </div>
          <div>
            <Label htmlFor="lga">City</Label>
            <Input id="lga" value={kycForm.lga} disabled />
          </div>
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input id="streetAddress" value={kycForm.streetAddress} disabled />
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
                  {bankOptions.length ? (
                    bankOptions.map((bank: Bank) => (
                      <SelectItem key={bank.name} value={bank.name}>
                        {bank.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      {bankFetchError ? 'Failed to load banks' : 'Loading banks...'}
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              type="tel"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setAccountNumber(value);
              }}
              placeholder="Enter 10-digit account number"
              maxLength={10}
            />
          </div>
          {kycForm.accountDetails && (
            <div className="p-4 bg-gray-100 rounded-md">
              <p><strong>Account Name:</strong> {kycForm.accountDetails.account_name}</p>
              <p><strong>Bank Name:</strong> {kycForm.accountDetails.Bank_name}</p>
              <p><strong>Account Number:</strong> {kycForm.accountDetails.account_number}</p>
              {/* <p><strong>Bank Code:</strong> {kycForm.accountDetails.bank_code}</p> */}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading || !kycForm.bankName || !accountNumber || accountNumber.length !== 10}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </Button>
        </form>
        {kycForm.accountDetails && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAcceptKYC}
              disabled={loading}
            >
              Accept KYC
            </Button>
            <Button variant="destructive" onClick={handleRejectKYC} disabled={loading}>
              Reject KYC
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}