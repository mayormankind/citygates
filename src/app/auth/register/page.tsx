"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebaseConfig";
import { State, User } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define Zod schema for form validation
const userSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits (excluding +234)"),
  state: z.string().min(1, "Please select a state"),
  lga: z.string().min(1, "Please select a local government area"),
  streetAddress: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address is too long"),
  // branch: z.string().optional(),
});

type FormData = z.infer<typeof userSchema>;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      state: "",
      lga: "",
      streetAddress: "",
      // branch: '',
    },
  });

  const watchedState = watch("state");

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "https://nigerian-states-and-lga.vercel.app/"
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setStates(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  // Reset LGA when state changes
  useEffect(() => {
    if (watchedState !== selectedState) {
      setSelectedState(watchedState);
      setValue("lga", "");
    }
  }, [watchedState, selectedState, setValue]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const [phoneQuery, emailQuery] = await Promise.all([
        getDocs(
          query(usersRef, where("phoneNumber", "==", `+234${data.phoneNumber}`))
        ),
        getDocs(query(usersRef, where("email", "==", data.email))),
      ]);

      if (!phoneQuery.empty) {
        toast.error("Phone number already in use.");
        setLoading(false);
        return;
      }
      if (!emailQuery.empty) {
        toast.error("Email address already in use.");
        setLoading(false);
        return;
      }

      const storeData = {
        name: `${data.firstName} ${data.lastName}`,
        phoneNumber: `+234${data.phoneNumber}`,
        branch: "",
        status: "pending",
        kyc: "pending",
        admins: [],
        createdAt: serverTimestamp(),
        role: "user",
        email: data.email,
        state: data.state,
        lga: data.lga,
        streetAddress: data.streetAddress,
      };

      await addDoc(collection(db, "prospects"), storeData);

      toast.success("Account created", {
        description:
          "Your account has been successfully created. Await verification and approval!",
      });

      setSuccessModal(true);

      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error", {
        description: "Failed to create the user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-4"
          >
            <div className="flex gap-4 items-center">
              <span className="text-gray-600">+234</span>
              <div className="flex-1">
                <Input
                  placeholder="Enter phone number (10 digits)"
                  className="shadow-none"
                  {...register("phoneNumber")}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                className="shadow-none"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="First Name"
                  className="shadow-none"
                  {...register("firstName")}
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Last Name"
                  className="shadow-none"
                  {...register("lastName")}
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Select
                onValueChange={(value) => setValue("state", value)}
                disabled={loading || states.length === 0}
              >
                <SelectTrigger className="w-full border py-4">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>States</SelectLabel>
                    {states.length > 0 ? (
                      states.map((state) => (
                        <SelectItem key={state.name} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Loading states...
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <Select
                onValueChange={(value) => setValue("lga", value)}
                disabled={loading || !selectedState}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Local Government Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>LGAs</SelectLabel>
                    {selectedState ? (
                      states
                        .find((state) => state.name === selectedState)
                        ?.lgas.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        Select a state first
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.lga && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lga.message}
                </p>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Street Address"
                className="shadow-none"
                {...register("streetAddress")}
                disabled={loading}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <p className="text-gray-500 text-xs">
              After registration, you will be contacted by one of our team
              members to facilitate your physical onboarding and complete KYC.
              Please wait to be contacted!
            </p>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </section>
      </div>

      {successModal && (
        <Dialog open={successModal} onOpenChange={setSuccessModal}>
          <DialogContent className="max-w-md h-full max-h-[70vh]">
            <div className="flex flex-col gap-8">
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
              <div className="flex p-8 bg-green-200 rounded-full mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600 animate-pulse transition-all duration-100" />
              </div>
              <p className="leading-4 font-medium text-black">
                Thank you for registering! Please wait for a confirmation SMS
                when you have been fully onboarded, which you’ll need to log in.
              </p>
            </div>
            <Link href={"/"} className="underline text-center">
              Go Home
            </Link>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
