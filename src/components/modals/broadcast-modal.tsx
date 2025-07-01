"use client";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch } from "@/lib/types";
import { collection, addDoc, serverTimestamp, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { MultiSelect } from "../ui/multi-select";

const broadcastSchema = z.object({
  category: z.enum(["all", "branches"], { message: "Please select a category!" }),
  branches: z.array(z.string()).min(1, "Please select at least one branch!").optional(),
  message: z.string().min(5, "Message must be at least 5 characters long!"),
});

type BroadcastData = z.infer<typeof broadcastSchema>;

interface BroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BroadcastModal({ open, onOpenChange }: BroadcastModalProps) {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [userCount, setUserCount] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<BroadcastData>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      category: "all",
      message: "",
      branches: [],
    },
  });

  // Fetch branches
  useEffect(() => {
    setLoadingBranches(true);
    const unsubscribeBranches = onSnapshot(
      collection(db, "branches"),
      (snapshot) => {
        const branchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Branch[];
        setBranches(branchesData);
        setLoadingBranches(false);
      },
      (error) => {
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches.");
        setLoadingBranches(false);
      }
    );
    return () => unsubscribeBranches();
  }, []);

  // Fetch user count based on category
  const fetchUserCount = async () => {
    setLoading(true);
    try {
      const category = watch("category");
      if (category === "all") {
        const usersSnapshot = await getDocs(collection(db, "users"));
        setUserCount(usersSnapshot.size);
      } else if (category === "branches" && watch("branches")?.length) {
        const usersPromises = (watch("branches") ?? []).map((branchId) =>
          getDocs(query(collection(db, "users"), where("branch", "==", branchId)))
        );
        const snapshots = await Promise.all(usersPromises);
        setUserCount(snapshots.reduce((sum, snap) => sum + snap.size, 0));
      } else {
        setUserCount(0);
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
      toast.error("Failed to fetch user count");
      setUserCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, [watch("category"), watch("branches")]);

  const onSubmit = async (data: BroadcastData) => {
    setLoading(true);
    console.log('we are here')
    try {
      const recipients = data.category === "all" ? ["all"] : data.branches || [];
      console.log({
          message: data.message,
          recipients,
          createdAt: serverTimestamp(),
        })
      await addDoc(collection(db, "broadcasts"), {
        message: data.message,
        recipients,
        createdAt: serverTimestamp(),
      });
      toast.success(`Broadcast sent to ${userCount} recipient${userCount !== 1 ? "s" : ""}`);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast.error("Failed to send broadcast");
    } finally {
      setLoading(false);
    }
  };

  const branchOptions = branches.map((branch) => ({
    label: branch.name,
    value: branch.id,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-full max-h-[60vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Announcement</DialogTitle>
          <DialogDescription>
            {watch("category") === "all"
              ? `Send message to all ${userCount} users.`
              : `Send message to ${userCount} user${userCount !== 1 ? "s" : ""} in selected branch(es).`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col space-y-4">
          <RadioGroup
            value={watch("category")}
            onValueChange={(value) => setValue("category", value as "all" | "branches")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Users</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="branches" id="branches" />
              <Label htmlFor="branches">Branches</Label>
            </div>
          </RadioGroup>

          {watch("category") === "branches" && (
            <div className="space-y-1">
              <Label htmlFor="branches">Branches</Label>
              <MultiSelect
                options={branchOptions}
                onValueChange={(values) => setValue("branches", values)}
                defaultValue={watch("branches") || []}
                disabled={loadingBranches || branches.length === 0}
                className="w-full"
              />
              {errors.branches && <p className="text-red-500 text-xs mt-1">{errors.branches.message}</p>}
            </div>
          )}

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

          <Button type="submit" disabled={loading || !watch("message")}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              `Send broadcast (${userCount} recipient${userCount !== 1 ? "s" : ""})`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}