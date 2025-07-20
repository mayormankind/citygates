// lib/auth.ts
import { useAuth } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getRoleName } from "./utils";
import { useBranchRole } from "@/context/BranchRoleContext";

export function useRoleGuard(
  requiredPermissions: string[],
  branchRestricted: boolean = false
) {
  const { admin } = useAuth();
  const { roles } = useBranchRole();

  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin?.role) {
      setLoading(false);
      setHasAccess(false);
      router.push("/auth/signin?tab=admin");
      return;
    }

    const roleRef = doc(db, "roles", admin.role);
    const unsubscribe = onSnapshot(
      roleRef,
      (doc) => {
        if (doc.exists()) {
          const roleData = doc.data();
          const permissions = roleData.permissions || [];
          const roleType = roleData.roleType || "General";
          const branchId = roleData.branchId || null;

          // Check if user has required permissions
          const hasRequiredPermissions = requiredPermissions.every((perm) =>
            permissions.includes(perm)
          );

          // Check branch restriction
          const isBranchValid = branchRestricted
            ? roleType === "Branch" && branchId === admin.branch
            : true;

          setHasAccess(
            getRoleName(admin.role, roles) === "Super Admin" ||
              (hasRequiredPermissions && isBranchValid)
          );
          setLoading(false);
        } else {
          setHasAccess(false);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error checking permissions:", error);
        setHasAccess(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [admin, requiredPermissions, branchRestricted, router]);

  return { hasAccess, loading };
}
