"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "../ui/password-input";

export default function SigninTabs({ initialTab = "signin-as-customer" }) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get("tab") === "admin" ? "signin-as-admin" : "signin-as-customer";
      setSelectedTab(tab);
    }
  }, [searchParams]);

  const handleAdminSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (!adminData.email || !adminData.password) {
      console.error("Email and password are required for admin sign-in.");
      toast.error("Email and password are required for admin sign-in.")
      return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, adminData.email, adminData.password);
        const user = userCredential.user;
        router.push("/dashboard/admin");
        toast("Admin signed in successfully!", {
          description: `Welcome back, ${user.email}`,
        });
        setAdminData({ email: "", password: "" }); // Reset form data
    } catch (err: any) {
        toast.error("Admin sign-in failed.", {
          description: err.message || "Please check your credentials and try again.",
        });
      setError("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full space-y-6">
      <div className="w-fit flex flex-col mx-auto items-center">
        <div className="w-10 h-10">
          <Image
            src="/logo.jpeg"
            width={1000}
            height={1000}
            alt="CityGates Logo"
            className="h-full"
          />
        </div>
        <h2 className="text-2xl font-bold">CityGates Food Bank</h2>
      </div>
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger
            value="signin-as-customer"
            className="data-[state=active]:bg-yellow-400 data-[state=active]:text-white"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="signin-as-admin"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Admin
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="signin-as-customer" id="customer" className="w-full">
        <div className="w-full flex flex-col space-y-4">
          <div className="flex gap-4 items-center">
            <h3>+234</h3>
            <Input placeholder="Enter your phone number." />
          </div>
          <Button>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Sending ...</>
            ): ( 'Send OTP')}
          </Button>
          <p className="text-center text-sm">
            New user?{" "}
            <span className="text-blue-700">
              <Link href="/auth/register">Register here.</Link>
            </span>
          </p>
        </div>
      </TabsContent>
      <TabsContent value="signin-as-admin" id="admin" className="w-full">
        <form action="" onSubmit={handleAdminSignin} className="w-full flex flex-col space-y-4">
          <Input placeholder="Enter your email" name="email" onChange={handleChange} value={adminData.email}/>
          <PasswordInput placeholder="Enter your password" name="password" onChange={handleChange} value={adminData.password}/>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Submitting ...</>
            ): ( 'Signin')} 
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}