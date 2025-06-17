import { Camera, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Prospect, State, Store } from '@/lib/types'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'


interface AddProspectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  Prospects: Prospect[]
}
export default function AddProspectModal({ open, onOpenChange, Prospects }: AddProspectModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        image: "",
        name: "",
        amount: "",
        tenure: "",
        description: "",
        status: "inactive",
    })

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
          const state = data;
          setStates(state || [])
        }
    
        fetchStates()
      }, [])

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {

      const StoreData = {
        image: formData.image,
        name: formData.name,
        amount: formData.amount,
        tenure: formData.tenure,
        description: formData.description,
        status: formData.status,
        createdAt: serverTimestamp(),
      }


      const docRef = await addDoc(collection(db, "store"), StoreData)

      // Create notification
    //   await notifyClassCreated(formData.name, docRef.id) 

      toast("Store created", {
        description: "The store has been successfully created.",
      })

      setFormData({ image: "", name: "", amount: "", tenure: "", description: "", status: "inactive" })
      onOpenChange(false)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create the store.",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Prospect</DialogTitle>
          <DialogDescription>Create a new CityGates prospect.</DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
