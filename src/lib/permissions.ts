import {
  Users,
  CircleDollarSign,
  GraduationCap,
  Store,
  ShieldUser,
  UserCog2,
  PackageOpen,
  GitBranch,
  Megaphone,
} from "lucide-react";
import { Permission } from "./types";

// lib/permissions.ts
export const permissionToRoutes: Record<string, string[]> = {
  "View Users": ["/dashboard/admin"],
  "View Prospects": ["/dashboard/admin/prospects"],
  "View Transactions": ["/dashboard/admin/transactions"],
  "View Products": ["/dashboard/admin/store"],
  "View Admins": ["/dashboard/admin/admins"],
  "View Roles": ["/dashboard/admin/roles"],
  "View Plans": ["/dashboard/admin/plans"],
  "View Branches": ["/dashboard/admin/branches"],
  "View Broadcasts": ["/dashboard/admin/broadcasts"],
  "Create Roles": ["/dashboard/admin/roles"],
  "Create Admins": ["/dashboard/admin/admins"],
  "Create Plans": ["/dashboard/admin/plans"],
  "Create Branch": ["/dashboard/admin/branches"],
  "Send Broadcasts": ["/dashboard/admin/broadcasts"],
  all: [
    "/dashboard/admin",
    "/dashboard/admin/transactions",
    "/dashboard/admin/prospects",
    "/dashboard/admin/store",
    "/dashboard/admin/admins",
    "/dashboard/admin/roles",
    "/dashboard/admin/plans",
    "/dashboard/admin/branches",
    "/dashboard/admin/broadcasts",
  ],
  // Add other permissions as needed, e.g., "Create Users" might enable actions but not new routes
};

export const navigation = [
  {
    name: "Users",
    href: "/dashboard/admin",
    icon: Users,
    requiredPermission: "View Users" as Permission,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CircleDollarSign,
    requiredPermission: "View Transactions" as Permission,
  },
  {
    name: "Prospects",
    href: "/dashboard/admin/prospects",
    icon: GraduationCap,
    requiredPermission: "View Prospects" as Permission,
  },
  {
    name: "Store",
    href: "/dashboard/admin/store",
    icon: Store,
    requiredPermission: "View Products" as Permission,
  },
  {
    name: "Admins",
    href: "/dashboard/admin/admins",
    icon: ShieldUser,
    requiredPermission: "View Admins" as Permission,
  },
  {
    name: "Roles",
    href: "/dashboard/admin/roles",
    icon: UserCog2,
    requiredPermission: "View Roles" as Permission,
  },
  {
    name: "Plans",
    href: "/dashboard/admin/plans",
    icon: PackageOpen,
    requiredPermission: "View Plans" as Permission,
  },
  {
    name: "Branches",
    href: "/dashboard/admin/branches",
    icon: GitBranch,
    requiredPermission: "View Branches" as Permission,
  },
  {
    name: "Broadcasts",
    href: "/dashboard/admin/broadcasts",
    icon: Megaphone,
    requiredPermission: "View Broadcasts" as Permission,
  },
];
