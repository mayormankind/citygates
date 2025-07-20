"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { useAuth } from "@/context/AdminContext";
import { useBranchRole } from "@/context/BranchRoleContext";
import { getRoleName } from "@/lib/utils";

export function DashboardHeader() {
  const { admin, loading, setAdminManually } = useAuth();
  const { branches, roles } = useBranchRole();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAdminManually(null);
      toast.success("Signed out successfully", {
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast.error("Error signing out", {
        description: "There was a problem signing you out.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!admin) return <div>Please sign in as an admin.</div>;

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {admin.role
              ? `${getRoleName(admin.role, roles)} Dashboard`
              : "Admin Dashboard"}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback className="capitalize">
                    {admin.email?.slice(0, 2) || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium truncate text-sm">
                    {admin.email || "Admin"}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {getRoleName(admin.role, roles) || "Administrator"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
