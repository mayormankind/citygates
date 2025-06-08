import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Blubs from "@/components/layout/blubs"
import React from 'react'

export const metadata: Metadata = {
  title: "Front Store",
  description: "Wondering what we have in our store? You have a chance to take a peep at our catalogue.",
  icons:'/globe.svg'
}

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
      <main className="w-full bg-white p-6 px-0 md:p-12 relative">
        <Blubs/>
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
            
        </div>
      </main>
    </div>
  )
}
