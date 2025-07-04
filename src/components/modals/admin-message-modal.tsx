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

const adminMessageSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters long!"),
  message: z.string().min(5, "Message must be at least 5 characters long!"),
});

type AdminMessageData = z.infer<typeof adminMessageSchema>;

interface AdminMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminName: string;
}

export default function AdminMessageModal({ open, onOpenChange, adminName }: AdminMessageModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<AdminMessageData>({
    resolver: zodResolver(adminMessageSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: AdminMessageData) => {
    setLoading(true);
    try {
        await sendEmail(adminName, {
            subject: data.subject,
            text: data.message,
        })
        toast.success(`Message has been sent to ${adminName}`);
        console.log(`Message has been sent to ${adminName}`);
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
          <DialogDescription> Send message to {adminName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">

          <div className="space-y-1">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject"
              className="shadow-none"
              {...register("subject")}
              disabled={loading}
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="message">Message</Label>
            <Input
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