"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";

// Extend the Window interface to include confirmationResult
declare global {
  interface Window {
    confirmationResult?: any;
  }
}

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || ""; // Match SigninTabs query param
  const { setUserManually } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (!window.confirmationResult) {
        throw new Error("No OTP session found. Please request a new OTP.");
      }

      const result = await window.confirmationResult.confirm(data.otp);
      const user = result.user;

      // Update UserContext with minimal user data
      setUserManually({
        uid: user.uid,
        id: user.uid,
        phoneNumber: user.phoneNumber || phoneNumber,
        name: user.displayName || "",
        email: user.email || "",
      });

      toast.success("Login successful", {
        description: "You have been successfully logged in.",
      });

      router.push("/dashboard/customer");
      reset();
    } catch (error: any) {
      console.error("OTP verification error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      toast.error(error.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense>
      <div className="w-full flex h-full min-h-screen bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-glow"></div>
        </div>
        <div className="m-auto w-full h-full min-h-5/7 bg-white max-w-lg grid rounded-md">
          <section className="w-full p-8 md:py-4 md:px-12">
            <div className="flex flex-col space-y-6 p-8">
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
                  <h2 className="text-2xl font-bold">CityGates Food Bank</h2>
                </div>
              </Link>
              <h3 className="text-xl font-semibold text-center">Verify OTP</h3>
              <p className="text-gray-500 text-center">
                An OTP has been sent to {phoneNumber}. Please enter it below.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="otp" className="text-sm font-medium">
                  OTP
                </Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  className="shadow-none"
                  {...register("otp")}
                  disabled={loading}
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <p className="text-gray-500 text-xs text-center">
                Didn’t receive an OTP?{" "}
                <Link href="/auth/signin" className="text-purple-600 underline">
                  Resend OTP
                </Link>
                .
              </p>
            </form>
          </section>
        </div>
      </div>
    </Suspense>
  );
}
