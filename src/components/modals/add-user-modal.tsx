import { Camera, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Admin, State, User } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AdminContext";

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
  branch: z.string().optional(),
});

type FormData = z.infer<typeof userSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  Users: User[];
}

export default function AddUserModal({
  open,
  onOpenChange,
  Users,
}: AddUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const { admin } = useAuth();

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
      branch: "",
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

  console.log(admin);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const storeData = {
        name: `${data.firstName} ${data.lastName}`,
        phoneNumber: `+234${data.phoneNumber}`,
        branch: admin?.branch || "",
        status: "pending",
        kyc: "pending",
        admins: 1,
        createdAt: serverTimestamp(),
        role: "user",
        email: data.email,
        state: data.state,
        lga: data.lga,
        streetAddress: data.streetAddress,
      };

      await addDoc(collection(db, "users"), storeData);

      toast.success("User created", {
        description: "The user has been successfully created.",
      });

      reset();
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new CityGates User.</DialogDescription>
        </DialogHeader>
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
              <p className="text-red-500 text-xs mt-1">{errors.lga.message}</p>
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

          <div>
            <Input
              placeholder="Branch (optional)"
              className="shadow-none"
              {...register("branch")}
              disabled={loading}
            />
            {errors.branch && (
              <p className="text-red-500 text-xs mt-1">
                {errors.branch.message}
              </p>
            )}
          </div>

          <p className="text-gray-500 text-xs">
            After registration, you will be contacted by one of our team members
            to facilitate your physical onboarding and complete KYC. Please wait
            to be contacted!
          </p>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Finish Onboarding User"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
