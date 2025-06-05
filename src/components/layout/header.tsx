'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About us', href: '/about' },
    { label: 'Store Front', href: '/store-front' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact', href: '/contacts' },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b shadow-sm relative z-20 bg-black/20 border-white/10">
    {/* <header className="backdrop-blur-md sticky top-0 border-b shadow-sm z-20 bg-black/30 border-white/10"> */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          CityGates
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-gray-700 items-center">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? 'text-gray-800 font-semibold border-b-2 border-gray-800 pb-1'
                  : 'hover:text-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Account Dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/auth/signin">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Sign in as Customer
                </DropdownMenuItem>
              </Link>
              <Link href="/auth/signin">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Sign in as Admin
                </DropdownMenuItem>
              </Link>
              <Link href="/auth/register">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Create Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (unchanged) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t px-6 py-4 space-y-4 text-gray-700"
          >
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block ${
                  pathname === href ? 'text-gray-800 font-medium' : ''
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t pt-4 space-y-2">
              <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="block">Sign in as Customer</Link>
              <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="block">Sign in as Admin</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block">Create Account</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
