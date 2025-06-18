"use client"


import { BreadcrumbNav } from '@/components/layout/breadcrum-nav';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Sidebar } from '@/components/layout/sidebar';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userData, firebaseUser, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/signin?tab=signin-as-admin");
    }else{
      router.push(`/dashboard/admin`);
    }
  }, [firebaseUser, loading, router]);


//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!firebaseUser) {
//     return null
//   }

  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex flex-col">
            {/* <DashboardHeader/> */}
            <main className="flex-1 overflow-auto">
              <div className="p-6">
                <BreadcrumbNav />
                {children}
              </div>
            </main>
        </div>
        <Toaster richColors />
    </div>
  );
};

export default DashboardLayout;