// src/context/UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { User } from "@/lib/types";

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUserManually: (userData: Partial<User> | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setUserManually = (userData: Partial<User> | null) => {
    if (userData === null) {
      setUser(null);
    } else {
      setUser(
        (prev) =>
          ({ ...prev, ...userData, createdAt: new Date() }) as User | null
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        setLoading(true);
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const unsubscribeUser = onSnapshot(
              userDocRef,
              (docSnap) => {
                if (docSnap.exists()) {
                  setUser({
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                  } as User);
                } else {
                  setUser(null);
                }
                setLoading(false);
              },
              (error) => {
                console.error("Snapshot error:", error);
                setUser(null);
                setLoading(false);
              }
            );
            return () => unsubscribeUser();
          } catch (error) {
            console.error("Auth state change error:", error);
            setUser(null);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUserManually }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
