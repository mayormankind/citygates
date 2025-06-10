"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Signin() {

  const [selectedTab, setSelectedTab] = useState('signin-as-customer');

  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'admin') {
      setSelectedTab('signin-as-admin');
    }
  }, [searchParams]);

  return (
    <div className='w-full flex h-full min-h-screen bg-gradient-to-r from-[#5B1A68] via-purple-800 to-[#5B1A68] relative overflow-hidden'>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2C400]/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F2C400]/5 rounded-full blur-2xl animate-glow"></div>
      </div>
      <div className="m-auto w-full min-h-5/7 bg-white max-w-3xl grid md:grid-cols-2 rounded-md">
        <div className="w-full h-full">
          <Image src={'/investment.jpg'} className='w-full h-full object-cover rounded-md' width={1000} height={1000} alt='Investment'/>
        </div>
        <div className="flex flex-col space-y-6 p-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className='w-full space-y-6'>
            <div className="w-fit flex flex-col mx-auto items-center">
              <div className="w-10 h-10">
                <Image src={'/logo.jpeg'} width={1000} height={1000} alt='CityGates Logo' className='h-full'/>
              </div>
              <h2 className='text-2xl font-bold'>CityGates Food Bank</h2>
            </div>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="signin-as-customer" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-white">Users</TabsTrigger>
                <TabsTrigger value="signin-as-admin" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Admin</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="signin-as-customer" id='customer' className="w-full">
              <div className="w-full flex flex-col space-y-4">
                <div className="flex gap-4 items-center">
                  <h3>+234</h3>
                  <Input placeholder='Enter your phone number.'/>
                </div>
                <Button>Send OTP</Button>
                <p className='text-center text-sm'>New user? {" "} <span className='text-blue-700'><Link href={'/auth/register'}>Register here.</Link></span></p>
              </div>
            </TabsContent>
            <TabsContent value="signin-as-admin" id={'admin'} className="w-full flex flex-col space-y-4">
              <Input placeholder='Enter your email'/>
              <Input placeholder='Enter your password'/>
              <Button>Signin</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
