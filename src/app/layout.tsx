import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import { AdminProvider } from "@/context/AdminContext";
import LoadingFallback from "@/components/layout/LoadingFallback";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { BranchRoleProvider } from "@/context/BranchRoleContext";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CityGates",
  description: "Your go-to loan and survival merchant",
  icons: "/globe.svg",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AdminProvider>
            <UserProvider>
              <BranchRoleProvider>
                {" "}
                <LoadingFallback />
                <main>
                  <Header />
                  {children}
                  <Footer />
                </main>
                <Toaster richColors position="top-center" />
              </BranchRoleProvider>
            </UserProvider>
          </AdminProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
