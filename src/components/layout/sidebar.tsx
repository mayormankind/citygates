"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Calendar,
  CircleDollarSign,
  Users2,
  Store,
  ShieldUser,
  GitBranch,
  MessageSquareText,
  Megaphone,
  UserCog2,
  PackageOpen,
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebaseConfig"
import { toast } from "sonner"

const navigation = [
  { name: "Users", href: "/dashboard/admin", icon: Users },
  { name: "Transactions", href: "/dashboard/admin/transactions", icon: CircleDollarSign },
  { name: "Prospects", href: "/dashboard/admin/prospects", icon: GraduationCap },
  { name: "Store", href: "/dashboard/admin/store", icon: Store },
  { name: "Admins", href: "/dashboard/admin/admins", icon: ShieldUser },
  { name: "Roles", href: "/dashboard/admin/roles", icon: UserCog2 },
  { name: "Plans", href: "/dashboard/admin/plans", icon: PackageOpen },
  { name: "Branches", href: "/dashboard/admin/branches", icon: GitBranch },
  { name: "Broadcasts", href: "/dashboard/admin/broadcasts", icon: Megaphone },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast("Signed out successfully", {
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      toast.error("Error signing out", {
        description: "There was a problem signing you out.",
      })
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl text-left font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-600 via-yellow-700 to-black">City Gates Food Bank</h1>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive ? "bg-blue-100 text-purple-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
