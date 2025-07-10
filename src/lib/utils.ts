import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Branch, Role } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/utils.ts

export const getBranchName = (branchId: string, branches: Branch[]) => {
  const branch = branches.find((b) => b.id === branchId);
  return branch ? branch.name : branchId;
};

export const getRoleName = (roleId: string, roles: Role[]) => {
  const role = roles.find((r) => r.id === roleId);
  return role ? role.name : roleId;
};
