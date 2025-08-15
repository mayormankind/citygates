// app/dashboard/customer/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { User } from "@/lib/types";

export default function CustomerDashboard() {
  //   const [userData, setUserData] = useState<User | null>(null);
  //   const [loading, setLoading] = useState(true);
  const router = useRouter();

  //   useEffect(() => {
  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //       if (!user) {
  //         router.push("/auth/signin");
  //         return;
  //       }

  //       const userRef = doc(db, "users", user.uid);
  //       onSnapshot(
  //         userRef,
  //         (doc) => {
  //           if (doc.exists()) {
  //             setUserData({ id: doc.id, ...doc.data() } as User);
  //           } else {
  //             toast.error("User data not found.");
  //             signOut(auth);
  //             router.push("/auth/signin");
  //           }
  //           setLoading(false);
  //         },
  //         (error) => {
  //           console.error("Error fetching user data:", error);
  //           toast.error("Failed to load user data.");
  //           setLoading(false);
  //         }
  //       );
  //     });

  //     return () => unsubscribe();
  //   }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out.");
    }
  };

  //   if (loading) {
  //     return (
  //       <div className="w-full flex h-full min-h-screen bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] relative overflow-hidden">
  //         <div className="m-auto flex items-center">
  //           <Loader2 className="h-8 w-8 animate-spin text-white" />
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!userData) {
  //     return null;
  //   }

  return (
    <div className="w-full flex h-full min-h-screen bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-glow"></div>
      </div>
      <div className="m-auto w-full max-w-4xl p-8">
        <div className="flex flex-col space-y-6 mb-8">
          <Link href={"/"}>
            <div className="w-fit flex flex-col mx-auto items-center">
              <div className="w-10 h-10">
                <Image
                  src={"/logo.jpeg"}
                  width={1000}
                  height={1000}
                  alt="CityGates Logo"
                  className="h-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">
                CityGates Food Bank
              </h2>
            </div>
          </Link>
        </div>
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Welcome, Mayowa</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              <strong>Email:</strong> mayowamakinde23@gmail.com
            </p>
            <p>
              <strong>Phone:</strong> +2347040829383
            </p>
            <p>
              <strong>Branch:</strong> Imola
            </p>
            <p>
              <strong>State:</strong> Oyo
            </p>
            <p>
              <strong>LGA:</strong> Akinyele
            </p>
            <p>
              <strong>Address:</strong> No 10 Majaro street
            </p>
            <p>
              <strong>Status:</strong> Active
            </p>
            <p>
              <strong>KYC:</strong> Active
            </p>
            <Button
              onClick={handleSignOut}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
