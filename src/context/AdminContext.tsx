// src/context/AdminContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Admin, Permission } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  permissions: Permission[];
  setAdminManually: (adminData: Partial<Admin> | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  permissions: [],
  loading: true,
  setAdminManually: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const setAdminManually = (adminData: Partial<Admin> | null) => {
    if (adminData === null) {
      setAdmin(null);
    } else {
      setAdmin(
        (prev) =>
          ({
            ...prev,
            ...adminData,
            createdAt: adminData.createdAt || prev?.createdAt || new Date(),
            id: adminData.id || prev?.id || "",
            email: adminData.email || prev?.email || "",
            phoneNumber: adminData.phoneNumber || prev?.phoneNumber || "",
            role: adminData.role || prev?.role || "",
            userType: adminData.userType || prev?.userType || "Admin",
            branchId: adminData.branch || prev?.branch || "", // Use branchId for clarity
            status: adminData.status || prev?.status || "pending",
            uid: adminData.uid || prev?.uid || "",
          }) as Admin
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        if (user) {
          const adminDocRef = doc(db, "admins", user.uid);
          const unsubscribeAdmin = onSnapshot(
            adminDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                const adminData: Admin = {
                  id: docSnap.id,
                  email: data.email || user.email || "",
                  phoneNumber: data.phoneNumber || "",
                  role: data.role || "",
                  userType: data.userType || "Admin",
                  branch: data.branch || "", // Renamed to branch
                  status: data.status || "active",
                  createdAt:
                    data.createdAt instanceof Timestamp
                      ? data.createdAt.toDate()
                      : new Date(),
                  uid: user.uid,
                };
                setAdmin(adminData);

                // Fetch role permissions
                if (data.role) {
                  const roleRef = doc(db, "roles", data.role);
                  onSnapshot(
                    roleRef,
                    (roleDoc) => {
                      if (roleDoc.exists()) {
                        const roleData = roleDoc.data();
                        // Special case for Super Admin
                        if (roleData.name === "Super Admin") {
                          setPermissions(["all"]);
                        } else {
                          setPermissions(
                            (roleData.permissions || []) as Permission[]
                          );
                        }
                      } else {
                        setPermissions([]);
                        toast.error("Role not found. Contact support.");
                      }
                      setLoading(false);
                    },
                    (error) => {
                      console.error("Error fetching role:", error);
                      setPermissions([]);
                      toast.error(
                        "Failed to load permissions. Please try again."
                      );
                      setLoading(false);
                    }
                  );
                } else {
                  setPermissions([]);
                  setLoading(false);
                }
              } else {
                // Fallback for new admin
                setAdmin({
                  id: user.uid,
                  email: user.email || "",
                  phoneNumber: "",
                  role: "",
                  userType: "Admin",
                  branch: "",
                  status: "pending",
                  createdAt: new Date(),
                  uid: user.uid,
                });
                setPermissions([]);
                setLoading(false);
              }
            },
            (error) => {
              console.error("Error fetching admin data:", error);
              setAdmin({
                id: user.uid,
                email: user.email || "",
                phoneNumber: "",
                role: "",
                userType: "Admin",
                branch: "",
                status: "pending",
                createdAt: new Date(),
                uid: user.uid,
              });
              setPermissions([]);
              toast.error("Failed to load admin data. Please try again.");
              setLoading(false);
            }
          );
          return () => unsubscribeAdmin();
        } else {
          setAdmin(null);
          setPermissions([]);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ admin, permissions, loading, setAdminManually }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AdminProvider");
  }
  return context;
};
