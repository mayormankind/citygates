"use client"

import { companyLinks, legalLinks, quickLinks, socialLinks } from '@/lib/globalConst';
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Store, X } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Footer() {

  const path = usePathname();

  const publicPaths = ['/', '/about', '/store-front', '/faqs', '/contacts'];

  const hideFooter = !publicPaths.includes(path);


  return (
    // <footer className={`${hideFooter ? 'hidden' : 'flex'} w-full text-white bg-[#1a202c] py-12`}>
    <footer className={`${hideFooter ? 'hidden' : 'flex'} w-full bg-gradient-to-br from-[#5B1A68] via-purple-900 to-gray-900 text-white relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

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

          <p className="text-purple-200 leading-relaxed max-w-md">From Savings to Sustenance, From Poverty to Progress. Empowering families through innovative food security and financial empowerment programs across Nigeria.</p>

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
                Suite C06, Afro Mall, Opposite International Building Materials Mkt Dei-Dei, FCT, Abuja</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-purple-200 ${social.color} transition-all duration-300 hover:bg-white/20 hover:scale-110`} aria-label={social.label}>
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

          {/* Legal Links */}
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
          
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8">
          <p className="text-gray-100">&copy; {new Date().getFullYear()} CityGates Food Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
