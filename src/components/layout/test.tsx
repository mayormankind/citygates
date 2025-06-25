// // app/components/modals/KycModal.tsx
// import React, { useState, useEffect, useMemo } from 'react';
// import { Button } from '../ui/button';
// import { Label } from '../ui/label';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
// import { Input } from '../ui/input';
// import { toast } from 'sonner';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
// import { Loader2 } from 'lucide-react';
// import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';
// import { User } from '@/lib/types';
// import axios from 'axios';

// interface Bank {
//   name: string;
//   code?: string;
// }

// interface AccountDetails {
//   accountName: string;
//   bankName: string;
//   accountNumber: string;
// }

// interface KycForm {
//   email: string;
//   phoneNumber: string;
//   firstName: string;
//   lastName: string;
//   state: string;
//   lga: string;
//   streetAddress: string;
//   bankName: string;
//   accountNumber: string;
//   accountDetails: AccountDetails | null;
// }

// interface KycModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   user: User | null;
//   onKycUpdate: () => void;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// export default function KycModal({ open, onOpenChange, user, onKycUpdate, loading, setLoading }: KycModalProps) {
//   const [kycForm, setKycForm] = useState<KycForm>({
//     email: '',
//     phoneNumber: '',
//     firstName: '',
//     lastName: '',
//     state: '',
//     lga: '',
//     streetAddress: '',
//     bankName: '',
//     accountNumber: '',
//     accountDetails: null,
//   });
//   const [nigerianBanks, setNigerianBanks] = useState<Bank[]>([]);
//   const [bankFetchError, setBankFetchError] = useState(false);

//   // Fetch Nigerian banks
//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         const response = await axios.get('https://nubapi.com/bank-json', {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         // Validate response structure
//         if (Array.isArray(response.data) && response.data.every((b: any) => typeof b.name === 'string')) {
//           setNigerianBanks(response.data);
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

//   // Pre-fill form with user data
//   useEffect(() => {
//     if (user) {
//       const nameParts = user.name.trim().split(/\s+/);
//       setKycForm({
//         email: user.email || '',
//         phoneNumber: user.phoneNumber ? String(user.phoneNumber) : '',
//         firstName: nameParts[0] || '',
//         lastName: nameParts.slice(1).join(' ') || '',
//         state: user.state || '',
//         lga: user.lga || '',
//         streetAddress: user.streetAddress || '',
//         bankName: '',
//         accountNumber: '',
//         accountDetails: null,
//       });
//     }
//   }, [user]);

//   const handleKycAccountVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!kycForm.accountNumber || kycForm.accountNumber.length !== 10 || !/^\d{10}$/.test(kycForm.accountNumber)) {
//       toast.error('Please enter a valid 10-digit account number.');
//       return;
//     }
//     if (!kycForm.bankName) {
//       toast.error('Please select a bank.');
//       return;
//     }
//     setLoading(true);

//     try {
//       const response = await axios.get(`https://nubapi.com/api/verify?account_number=${kycForm.accountNumber}&bank_code=${nigerianBanks.find(b => b.name === kycForm.bankName)?.code}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       });
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
//     if (!user?.id) {
//       toast.error('Invalid user data.');
//       return;
//     }
//     if (!kycForm.accountDetails) {
//       toast.error('Please verify the account first.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const userRef = doc(db, 'users', user.id);
//       await updateDoc(userRef, {
//         kyc: 'approved',
//         status: 'pending',
//         bankName: kycForm.accountDetails.bankName,
//         accountNumber: kycForm.accountDetails.accountNumber,
//         accountName: kycForm.accountDetails.accountName,
//       });
//       // Log audit trail
//       await addDoc(collection(db, 'kyc_audits'), {
//         userId: user.id,
//         action: 'approved',
//         timestamp: serverTimestamp(),
//         performedBy: auth.currentUser?.uid,
//       });
//       toast.success('KYC accepted. User awaiting activation.');
//       onOpenChange(false);
//       onKycUpdate();
//     } catch (error) {
//       console.error('Error accepting KYC:', error);
//       toast.error('Failed to accept KYC.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRejectKYC = async () => {
//     if (!user?.id) {
//       toast.error('Invalid user data.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const userRef = doc(db, 'users', user.id);
//       await updateDoc(userRef, {
//         kyc: 'rejected',
//       });
//       // Log audit trail
//       await addDoc(collection(db, 'kyc_audits'), {
//         userId: user.id,
//         action: 'rejected',
//         timestamp: serverTimestamp(),
//         performedBy: auth.currentUser?.uid,
//       });
//       toast.error('KYC rejected.');
//       onOpenChange(false);
//       onKycUpdate();
//     } catch (error) {
//       console.error('Error rejecting KYC:', error);
//       toast.error('Failed to reject KYC.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Memoize bank options to prevent re-renders
//   const bankOptions = useMemo(() => nigerianBanks, [nigerianBanks]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Finish KYC</DialogTitle>
//           <DialogDescription>Complete the KYC process for {user?.name || 'User'}.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleKycAccountVerification} className="grid gap-4 py-4">
//           <div>
//             <Label htmlFor="email">Email Address</Label>
//             <Input id="email" value={kycForm.email} disabled />
//           </div>
//           <div className="flex gap-4 items-center">
//             <span className="text-gray-600">+234</span>
//             <div className="flex-1">
//               <Label htmlFor="phoneNumber">Phone Number</Label>
//               <Input
//                 id="phoneNumber"
//                 value={kycForm.phoneNumber.replace(/^\+234/, '')}
//                 disabled
//               />
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <div className="flex-1">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input id="firstName" value={kycForm.firstName} disabled />
//             </div>
//             <div className="flex-1">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input id="lastName" value={kycForm.lastName} disabled />
//             </div>
//           </div>
//           <div>
//             <Label htmlFor="state">State</Label>
//             <Input id="state" value={kycForm.state} disabled />
//           </div>
//           <div>
//             <Label htmlFor="lga">City</Label>
//             <Input id="lga" value={kycForm.lga} disabled />
//           </div>
//           <div>
//             <Label htmlFor="streetAddress">Street Address</Label>
//             <Input id="streetAddress" value={kycForm.streetAddress} disabled />
//           </div>
//           <div>
//             <Label htmlFor="bankName">Bank Name</Label>
//             <Select onValueChange={(value) => setKycForm({ ...kycForm, bankName: value })} value={kycForm.bankName}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Bank" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Banks</SelectLabel>
//                   {bankOptions.length ? (
//                     bankOptions.map((bank) => (
//                       <SelectItem key={bank.name} value={bank.name}>
//                         {bank.name}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <SelectItem value="none" disabled>
//                       {bankFetchError ? 'Failed to load banks' : 'Loading banks...'}
//                     </SelectItem>
//                   )}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="accountNumber">Account Number</Label>
//             <Input
//               id="accountNumber"
//               value={kycForm.accountNumber}
//               onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
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
//           <Button type="submit" disabled={loading || !kycForm.bankName || !kycForm.accountNumber}>
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Verifying...
//               </>
//             ) : (
//               'Verify Account'
//             )}
//           </Button>
//         </form>
//         {kycForm.accountDetails && (
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
//               Cancel
//             </Button>
//             <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAcceptKYC} disabled={loading}>
//               Accept KYC
//             </Button>
//             <Button variant="destructive" onClick={handleRejectKYC} disabled={loading}>
//               Reject KYC
//             </Button>
//           </DialogFooter>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


// app/components/modals/KycModal.tsx
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
import { debounce } from 'lodash'; // Install lodash: npm install lodash

interface Bank {
  name: string;
  code?: string;
}

interface AccountDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
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

  // Debounced state update for account number
  const debouncedSetAccountNumber = useMemo(
    () => debounce((value: string) => setAccountNumber(value), 300),
    []
  );

  // Fetch Nigerian banks
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://nubapi.com/bank-json', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_NUBAPI_TOKEN || 'missing-token'}`,
            'Content-Type': 'application/json',
          },
        });
        if (Array.isArray(response.data) && response.data.every((b: any) => typeof b.name === 'string')) {
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
        lastName: nameParts.slice(1).join(' ') || '',
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
    setLoading(true);

    try {
      // Use Next.js API route for verification
      const response = await axios.get(`/api/verify-account?account_number=${accountNumber}&bank_name=${encodeURIComponent(kycForm.bankName)}`);
      const data = response.data;
      if (data.accountName && data.bankName && data.accountNumber) {
        setKycForm((prev) => ({ ...prev, accountDetails: data }));
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
        bankName: kycForm.accountDetails.bankName,
        accountNumber: kycForm.accountDetails.accountNumber,
        accountName: kycForm.accountDetails.accountName,
      });
      await addDoc(collection(db, 'kyc_audits'), {
        userId: user.id,
        action: 'approved',
        timestamp: serverTimestamp(),
        performedBy: auth.currentUser?.uid,
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
        performedBy: auth.currentUser?.uid,
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

  // Memoize bank options
  const bankOptions = useMemo(() => nigerianBanks, [nigerianBanks]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finish KYC</DialogTitle>
          <DialogDescription>Complete the KYC process for {user?.name || 'User'}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleKycAccountVerification} className="grid gap-4 py- **Note**: The provided code is incomplete, ending mid-form. I’ll assume the remaining JSX matches the previous version and include it here for completeness.

```jsx
        <form onSubmit={handleKycAccountVerification} className="grid gap-3 py-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={kycForm.email} disabled />
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">+234</span>
            <div className="flex-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={kycForm.phoneNumber.replace(/^\+234/, '')}
                disabled
              />
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
              onValueChange={(value) => setKycForm((prev) => ({ ...prev, bankName: value }))}
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
                debouncedSetAccountNumber(value);
                setAccountNumber(value);
              }}
              placeholder="Enter 10-digit account number"
              maxLength={10}
            />
          </div>
          {kycForm.accountDetails && (
            <div className="p-4 bg-gray-100 rounded-md">
              <p><strong>Account Name:</strong> {kycForm.accountDetails.accountName}</p>
              <p><strong>Bank Name:</strong> {kycForm.accountDetails.bankName}</p>
              <p><strong>Account Number:</strong> {kycForm.accountDetails.accountNumber}</p>
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