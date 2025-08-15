"use client";

import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { CustomerSidebar } from "@/components/layout/customerSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/context/AdminContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin?tab=customer");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div
        className={cn(
          "flex-shrink-0 bg-gray-800/50 transition-all duration-300"
        )}
      >
        <CustomerSidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col w-full">
        <main>
          <div className="p-4 md:p-6 space-y-4">
            <DashboardHeader />
            <BreadcrumbNav />
            {children}
          </div>
        </main>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default DashboardLayout;
