import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Facebook, Instagram, Linkedin, MapPin, Phone, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Contact() {
  return (
    <div className="w-full">
      <div className="relative w-full h-80">
        <Image
          src="/store.jpg"
          alt="Our store front"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-white text-4xl font-bold">Our Store Front</h1>
        </div>
      </div>
      <main className="w-full bg-white p-6 px-0 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
            
        </div>
      </main>
    </div>
  )
}
