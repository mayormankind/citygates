import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Facebook, Instagram, Linkedin, MapPin, Phone, X } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


export const metadata: Metadata = {
    title: "Contact Us",
    description: "Reach out to CityGates today.",
    icons:'/globe.svg'
}

export default function Contact() {
  return (
    <div className="w-full">
      <div className="relative w-full h-80">
        <Image
          src="/contact.jpg"
          alt="About us"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-white text-4xl font-bold">Contact Us</h1>
        </div>
      </div>
      <main className="w-full bg-white p-6 px-0 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
            <section id='contactInfo' className="flex flex-col w-full space-y-12 p-4 md:p-8">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-black">Contact Information</h1>
                    <p className='text-black/40'>Ask us any questions you have.</p>
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="flex gap-4 items-center">
                        <MapPin className='w-10 h-10'/>
                        Suite C06, Afro Mall, Opposite International Building Materials Mkt Dei-Dei, FCT, Abuja
                    </div>
                    <Link href={'tel:+2349112621533'}>
                        <div className="flex gap-4">
                            <Phone className='w-6 h-6'/>
                            +234 911 262 1533
                        </div>
                    </Link>
                </div>
                <ul className="flex space-x-4 text-gray-500">
                    <li>
                        <Link href="#" className="hover:text-blue-600 transition-colors">
                            <Facebook/>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:text-gray-700 transition-colors">
                        <X/>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:text-pink-700 transition-colors">
                        <Instagram/>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="hover:text-blue-500 transition-colors">
                        <Linkedin/>
                        </Link>
                    </li>
                </ul>
            </section>
            <section id='contactForm' className="w-full p-4 md:p-8 bg-blue-50 rounded-md">
                <form action="" className='flex flex-col space-y-8'>
                    <h1 className="text-3xl font-bold text-black">Leave us a message!</h1>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Your email address</Label>
                        <Input id='email' placeholder='Enter your email'/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="message">Your email address</Label>
                        <Textarea id='message' placeholder='Enter your email'/>
                    </div>
                    <Button>Send Message</Button>
                </form>
            </section>
        </div>
        <div className="my-10 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Find Us Here</h2>
            <div className="w-full h-96">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.3651562031155!2d7.330872714280045!3d9.10337879350621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e75e2289d4557%3A0xe77b3e6f62dcd5fa!2sDei-Dei%2C%20Abuja!5e0!3m2!1sen!2sng!4v1717452500504!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
      </main>
    </div>
  )
}
