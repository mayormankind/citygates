"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "../ui/password-input";
import { useAuth } from "@/context/AdminContext";

export default function SigninTabs({ initialTab = "signin-as-customer" }) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter();
  const { admin, loading: authLoading, setAdminManually } = useAuth();
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (searchParams) {
      const tab =
        searchParams.get("tab") === "admin"
          ? "signin-as-admin"
          : "signin-as-customer";
      setSelectedTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Cleanup reCAPTCHA on component unmount
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const handleAdminSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (!userData.email || !userData.password) {
      toast.error("Email and password are required for admin sign-in.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      setAdminManually({ id: user.uid, email: user.email || "" });

      router.push("/dashboard/admin");
      toast.success("Admin signed in successfully!", {
        description: `Welcome back, ${user.email}`,
      });
      setUserData({ email: "", password: "", phone: "" });
    } catch (err: any) {
      toast.error(
        "Admin sign-in failed.",
        err.message || "Please check your credentials and try again."
      );
      setError("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSignin = async () => {
    setIsLoading(true);
    if (!userData.phone) {
      toast.error("Phone number is required to send OTP.");
      setIsLoading(false);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }

    const formattedPhoneNumber = `+234${userData.phone}`;

    try {
      // Verify reCAPTCHA container exists
      const recaptchaContainer = document.getElementById("recaptcha-container");
      if (!recaptchaContainer) {
        throw new Error(
          "reCAPTCHA container not found. Please refresh the page."
        );
      }

      // Initialize reCAPTCHA
      console.log("Initializing RecaptchaVerifier for:", formattedPhoneNumber);
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified successfully.");
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired.");
            toast.error("Security check expired. Please try again.");
            setIsLoading(false);
          },
          "error-callback": (error: any) => {
            console.error("reCAPTCHA error:", error);
            toast.error(
              "Security check failed. Please try again or contact support."
            );
            setIsLoading(false);
          },
        }
      );

      // Render reCAPTCHA
      await recaptchaRef.current.render();
      console.log("reCAPTCHA rendered successfully.");

      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaRef.current
      );

      toast.success(`OTP sent to ${formattedPhoneNumber}`);
      router.push(
        `/auth/verify-otp?phone=${encodeURIComponent(formattedPhoneNumber)}`
      );
      window.confirmationResult = confirmationResult;
      setUserData({ email: "", password: "", phone: "" });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let userMessage = "Failed to send OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        userMessage =
          "Invalid phone number. Please enter a valid number (e.g., 08123456789).";
      } else if (error.code === "auth/too-many-requests") {
        userMessage =
          "Too many attempts. Please wait a few minutes and try again.";
      } else if (error.code === "auth/quota-exceeded") {
        userMessage =
          "Daily OTP limit reached. Please try again tomorrow or contact support.";
      }
      toast.error(error.message || "Failed to send OTP. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full space-y-6"
    >
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
            <Input
              type="tel"
              placeholder="Enter your phone number"
              name="phone"
              onChange={handleChange}
              value={userData.phone}
              maxLength={10}
            />
          </div>
          <div id="recaptcha-container"></div>

          <Button onClick={handleCustomerSignin} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending ...
              </>
            ) : (
              "Send OTP"
            )}
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
        <form
          onSubmit={handleAdminSignin}
          className="w-full flex flex-col space-y-4"
        >
          <Input
            placeholder="Enter your email"
            name="email"
            onChange={handleChange}
            value={userData.email}
          />
          <PasswordInput
            placeholder="Enter your password"
            name="password"
            onChange={handleChange}
            value={userData.password}
          />
          <Button type="submit" disabled={isLoading || authLoading}>
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting ...
              </>
            ) : (
              "Signin"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
