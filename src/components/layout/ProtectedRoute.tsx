// components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AdminContext";
import { useEffect } from "react";
import { Permission } from "@/lib/types";
import UnauthorizedPage from "./UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
}

export function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const { permissions, loading, admin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/auth/signin?tab=admin");
    }
  }, [loading, admin, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    // While redirecting, render nothing
    return null;
  }

  if (
    !permissions.includes(requiredPermission) &&
    !permissions.includes("all")
  ) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
