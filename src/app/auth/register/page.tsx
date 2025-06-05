"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface State {
  name: string,
  lgas: string[],
}

export default function Register() {

  const [states, setStates] = useState<State[]>([])
  const [ selectedState, setSelectedState ] = useState('');
 
  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error("Fetch error:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchStates = async () => {
      const data = await fetchData("https://nigerian-states-and-lga.vercel.app/")
      // const stateNames = data?.map((state: { name: string }) => state.name)
      const state = data;
      setStates(state || [])
    }

    fetchStates()
  }, [])

  console.log(states);
  console.log(selectedState);

  return (
    <div className='w-full flex h-full min-h-screen bg-gray-200'>
      <div className="m-auto w-full h-full min-h-5/7 bg-white max-w-lg grid rounded-md">
        <section className="w-full p-8 md:py-4 md:px-12">
          <div className="flex flex-col space-y-6 p-8">
            <div className="w-fit flex flex-col mx-auto items-center">
              <div className="w-10 h-10">
                <Image src={'/logo.jpeg'} width={1000} height={1000} alt='CityGates Logo' className='h-full'/>
              </div>
              <h2 className='text-2xl font-bold'>CityGates Food Bank</h2>
            </div>
          </div>
          <form className="w-full flex flex-col space-y-2">
            <div className="flex gap-4 items-center">
              <h3>+234</h3>
              <Input placeholder='Enter your phone number.' className='shadow-none'/>
            </div>
            <Input type='email' placeholder='Email Address. ' className='shadow-none'/>
            <div className="flex gap-2">
              <Input placeholder='First Name' className='shadow-none'/>
              <Input placeholder='Last Name' className='shadow-none'/>
            </div>
            <Select onValueChange={setSelectedState}>
              <SelectTrigger className="w-full border py-4">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent className='w-[180px]'>
                <SelectGroup>
                  <SelectLabel>States</SelectLabel>
                  {states.length > 0 ? (
                    states.map((state, index) => (
                      <SelectItem key={index} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">Loading states...</div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select disabled={!selectedState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Local Government Area" />
              </SelectTrigger>
              <SelectContent className='w-[180px]'>
                <SelectGroup>
                  <SelectLabel>LGAs</SelectLabel>
                    {selectedState ? (
                      states.find(state => state.name === selectedState)?.lgas.map((lga, index) => (
                        <SelectItem key={index} value={lga}>
                          {lga}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">Select a state first</div>
                    )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea placeholder='Street Address' className='shadow-none'/>
            <span className='text-gray-500 text-xs my-4'>After registration, you will be conatcted by one of the team to facilitate your physical onboarding and complete KYC, Kindly wait to be contacted!</span>
            <Button>Continue</Button>
          </form>
        </section>
      </div>
    </div>
  )
}