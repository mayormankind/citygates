"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useState } from "react";
import { sendEmail } from "@/lib/sendmail";
import { Textarea } from "../ui/textarea";

const userMessageSchema = z.object({
  message: z.string().min(5, "Message must be at least 5 characters long!"),
});

type UserMessageData = z.infer<typeof userMessageSchema>;

interface UserMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
}

export default function UserMessageModal({ open, onOpenChange, userName }: UserMessageModalProps) {
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

  const onSubmit = async (data: UserMessageData) => {
    setLoading(true);
    try {
        // await sendEmail(userName, {
        //     subject: "",
        //     text: data.message,
        // })
        toast.success(`Message has been sent to ${userName}`);
        console.log(`Message has been sent to ${userName}`);
        onOpenChange(false);
        reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription> Send message to {userName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">

          <div className="space-y-1">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter message"
              className="shadow-none"
              {...register("message")}
              disabled={loading}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
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