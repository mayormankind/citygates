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
  phoneNumber: number;
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
  phoneNumber: number;
  state: string;
  lga: string;
  streetAddress: string;
  branch?: string;
  role: string;
  status: string;
  kyc: string;
  admins: number;
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
