import { FieldValue } from "firebase/firestore";

export interface Plan {
  id: string;
  name: string;
  amount: number;
  image: string;
  status: string;
  tenure: number;
  description: string;
  createdAt: Date;
}

export interface Store {
  id: string;
  image: string;
  name: string;
  // visibility: string
  price: number;
  status: string;
  description: string;
  createdAt: Date;
}

export interface State {
  name: string;
  lgas: string[];
}

// export interface Prospect {
//     id: string
//     name: string
//     amount: number
//     image: string
//     status: string
//     tenure: number
//     description: string
//     createdAt: Date
// }

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  state: string;
  lga: string;
  streetAddress: string;
  branch?: string;
  role: string;
  status: string;
  kyc: string;
  admins: number;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  state: string;
  lga: string;
  streetAddress: string;
  branch?: string;
  role: string;
  status: string;
  kyc: string;
  admins: string[];
  createdAt: Date;
  userPlans?: UserPlan[];
}

export interface UserPlan {
  id: string;
  planId: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  phoneNumber: string;
  role: string;
  userType: "Admin" | "Super Admin";
  branch: string;
  status: string;
  createdAt: Date | FieldValue;
  uid: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId?: string;
  planId: string;
  transactionType: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  UpdatedAt?: Date;
}

export type Permission =
  | "View Roles"
  | "Create Roles"
  | "Edit Roles"
  | "View Plans"
  | "Create Plans"
  | "Edit Plans"
  | "Pause/Resume Plans"
  | "View Users"
  | "View Prospects"
  | "Onboard Prospects"
  | "Create User"
  | "Edit User Profile"
  | "Send Message"
  | "Approve/Reject KYC"
  | "Activate/Deactivate User"
  | "Assign Admin"
  | "Add New Plan"
  | "Place Withdrawals"
  | "Place Deposit"
  | "View Transactions"
  | "Approve/Reject Withdrawal"
  | "Approve/Reject Deposit"
  | "View Admins"
  | "Create Admins"
  | "Edit Profile"
  | "Change Password"
  | "Activate/Deactivate Admin"
  | "View Branches"
  | "Create Branch"
  | "Edit Branch"
  | "View Broadcasts"
  | "Send Broadcasts"
  | "View Products"
  | "Create Product"
  | "Delete Product"
  | "Edit Product"
  | "Hide/Show Product"
  | "all";
