"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot, FieldValue } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Admin } from "@/lib/types";

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  setAdminManually: (adminData: Partial<Admin | null>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const setAdminManually = (adminData: Partial<Admin> | null) => {
    if (adminData === null) {
      setAdmin(null); // Explicitly set to null to clear the state
    } else {
      setAdmin(
        (prev) =>
          ({
            ...prev,
            ...adminData,
            createdAt: adminData.createdAt || new Date(),
          }) as Admin | null
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        setLoading(true);
        if (user) {
          try {
            const adminDocRef = doc(db, "admins", user.uid);
            console.log("Fetching admin data for user:", user.uid);
            console.log("Admin document reference:", adminDocRef);
            const unsubscribeAdmin = onSnapshot(
              adminDocRef,
              (docSnap) => {
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  setAdmin({
                    id: docSnap.id,
                    email: data.email || user.email || "",
                    phoneNumber: data.phoneNumber || "",
                    role: data.role || "",
                    userType: data.userType || "Admin",
                    branch: data.branch || "",
                    status: data.status || "active", // Default to "active" if missing
                    createdAt:
                      data.createdAt instanceof FieldValue
                        ? new Date()
                        : data.createdAt?.toDate() || new Date(),
                    uid: user.uid,
                  } as Admin);
                } else {
                  // Fallback for new admin or missing document
                  setAdmin({
                    id: user.uid,
                    email: user.email || "",
                    phoneNumber: "",
                    role: "",
                    userType: "Admin", // Default userType
                    branch: "",
                    status: "pending", // Default status for new admin
                    createdAt: new Date(),
                    uid: user.uid,
                  } as Admin);
                }
                setLoading(false);
              },
              (error) => {
                console.error("Snapshot error:", error);
                // Fallback with minimal data from auth user
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
                } as Admin);
                setLoading(false);
              }
            );
            return () => unsubscribeAdmin();
          } catch (error) {
            console.error("Auth state change error:", error);
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
            } as Admin);
            setLoading(false);
          }
        } else {
          setAdmin(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, setAdminManually }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AdminProvider");
  }
  return context;
};
