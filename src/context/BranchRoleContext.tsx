"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Branch, Role } from "@/lib/types";

interface BranchRoleContextType {
  branches: Branch[];
  roles: Role[];
  loading: boolean;
}

const BranchRoleContext = createContext<BranchRoleContextType | undefined>(
  undefined
);

export function BranchRoleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesSnapshot = await getDocs(collection(db, "roles"));
        const roleData = rolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          permissions: doc.data().permissions || [],
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Role[];
        setRoles(roleData);

        const branchesSnapshot = await getDocs(collection(db, "branches"));
        const branchData = branchesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Branch[];
        setBranches(branchData);
      } catch (error) {
        console.error("Error fetching branches or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BranchRoleContext.Provider value={{ branches, roles, loading }}>
      {children}
    </BranchRoleContext.Provider>
  );
}

export const useBranchRole = () => {
  const context = useContext(BranchRoleContext);
  if (context === undefined) {
    throw new Error("useBranchRole must be used within a BranchRoleProvider");
  }
  return context;
};
