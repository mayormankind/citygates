import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <div className="w-full h-screen max-h-screen">
      <div className="relative w-full h-full">
        <Image
          src="/banner.png"
          alt="Hero image"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {/* <h1 className="text-white text-4xl font-bold">Contact Us</h1> */}
        </div>
      </div>
    </div>
  )
}
