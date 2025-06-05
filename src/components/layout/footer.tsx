"use client"

import { Facebook, Instagram, Linkedin, Store, X } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Footer() {

  const path = usePathname();

  const hideFooter = path === '/auth/register' || path === '/auth/signin' ? true : false;

  return (
    <div className={`${hideFooter ? 'hidden' : 'flex'} w-full text-white bg-gray-900 py-12`}>
      <div className="container flex mx-auto flex-col py-4 px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">City Gates</span>
            </div>
            <p className="text-gray-400">
                From Savings to Sustenance, From Poverty to Progress
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/store-front" className="hover:text-white transition-colors">
                  Store front
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="" className="hover:text-white transition-colors">
                  Plans and Packages
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg mb-4 font-semibold">About</h2>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">Company</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">Faqs</Link>
              </li>
              {/* <li>
                <Link href="#" className="hover:text-white transition-colors">Careers</Link>
              </li> */}
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          <div className=''>
            <h4 className="font-semibold mb-4">Follow us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                    <Facebook/>
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  <X/>
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  <Instagram/>
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  <Linkedin/>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8">
          <p className="text-gray-100">&copy; {new Date().getFullYear()} EduGrade. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
