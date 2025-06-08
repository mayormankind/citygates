"use client"

import { Facebook, Instagram, Linkedin, MapPin, Store, X, Phone, Mail, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const path = usePathname()
  const hideFooter = path === "/auth/register" || path === "/auth/signin" ? true : false

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: X, href: "#", label: "Twitter", color: "hover:text-gray-300" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
  ]

  const quickLinks = [
    { name: "Store Front", href: "/store-front" },
    { name: "Plans & Packages", href: "#packages" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
  ]

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Careers", href: "#" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Disclaimer", href: "#" },
  ]

  return (
    <footer
      className={`${
        hideFooter ? "hidden" : "block"
      } w-full bg-gradient-to-br from-[#5B1A68] via-purple-900 to-gray-900 text-white relative overflow-hidden`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/3 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(242, 196, 0, 0.3) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Stay Updated with CityGates</h3>
                <p className="text-purple-200">
                  Get the latest updates on our food packages, investment opportunities, and community impact stories.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-purple-200 focus:border-[#F2C400] focus:ring-[#F2C400]"
                />
                <Button className="bg-gradient-to-r from-[#F2C400] to-yellow-500 text-[#5B1A68] hover:from-yellow-500 hover:to-[#F2C400] font-semibold px-6">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#F2C400] to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-[#5B1A68]" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">CityGates</span>
                  <p className="text-sm text-purple-200">Food Bank Ltd</p>
                </div>
              </div>

              <p className="text-purple-200 leading-relaxed max-w-md">
                From Savings to Sustenance, From Poverty to Progress. Empowering families through innovative food
                security and financial empowerment programs across Nigeria.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-purple-200">
                  <Phone className="h-5 w-5 text-[#F2C400]" />
                  <Link href="tel:+2349112621533" className="hover:text-white transition-colors">
                    +234 911 262 1533
                  </Link>
                </div>
                <div className="flex items-center space-x-3 text-purple-200">
                  <Mail className="h-5 w-5 text-[#F2C400]" />
                  <Link href="mailto:info@citygatesfoodbank.com" className="hover:text-white transition-colors">
                    info@citygatesfoodbank.com
                  </Link>
                </div>
                <div className="flex items-start space-x-3 text-purple-200">
                  <MapPin className="h-5 w-5 text-[#F2C400] mt-1 flex-shrink-0" />
                  <p className="hover:text-white transition-colors">
                    Suite C06, Afro Mall, Opposite International Building Materials Mkt Dei-Dei, FCT, Abuja
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-purple-200 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-[#F2C400] transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-[#F2C400] transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-[#F2C400] transition-colors duration-300 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div>
              <h4 className="font-semibold text-white mb-6">Certifications</h4>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-white">CAC Registered</span>
                  </div>
                  <p className="text-xs text-purple-200">Corporate Affairs Commission</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-white">Secure Platform</span>
                  </div>
                  <p className="text-xs text-purple-200">SSL Encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-purple-200">
                <span>&copy; {new Date().getFullYear()} CityGates Food Bank Ltd. All rights reserved.</span>
              </div>

              <div className="flex items-center space-x-2 text-purple-200">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-400 animate-pulse" />
                <span>for Nigerian families</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-purple-200">
                <Link href="#" className="hover:text-[#F2C400] transition-colors">
                  Privacy
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-[#F2C400] transition-colors">
                  Terms
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-[#F2C400] transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}