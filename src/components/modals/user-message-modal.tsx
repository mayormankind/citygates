"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { sendMessage } from "@/lib/sendmessage";
import { User } from "@/lib/types";

const userMessageSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters long!"),
});

type UserMessageData = z.infer<typeof userMessageSchema>;

interface UserMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export default function UserMessageModal({
  open,
  onOpenChange,
  user,
}: UserMessageModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<UserMessageData>({
    resolver: zodResolver(userMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const notifyCustomer = async (data: UserMessageData) => {
    setLoading(true);
    try {
      const formattedPhoneNumber = user?.phoneNumber?.replace("+", "") ?? "";
      console.log("Sending to:", {
        to: formattedPhoneNumber,
        message: data.message,
        from: "CityGates",
      });
      const response = await sendMessage(
        formattedPhoneNumber,
        data.message,
        "CityGates"
      );
      console.log("Response:", response);
      toast.success(`Message has been sent to ${user?.name}`);
      console.log(`Message has been sent to ${user?.name}`);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>Send message to {user?.name}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(notifyCustomer)}
          className="w-full flex flex-col space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter message"
              className="shadow-none"
              {...register("message")}
              disabled={loading}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              `Send Message`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
