import { Camera, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Store } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { uploadToCloudinary } from '@/lib/cloudinary'


interface AddStoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  Stores: Store[]
}
export default function AddStoreModal({ open, onOpenChange, Stores }: AddStoreModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        image: "",
        name: "",
        amount: "",
        tenure: "",
        description: "",
        status: "inactive",
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
        setLoading(true)
        const { url } = await uploadToCloudinary(file, "store")
        setFormData({ ...formData, image: url })
        toast("Image uploaded",{
            description: "Profile image has been uploaded successfully.",
        })
        } catch (error) {
        toast.error("Upload failed", {
            description: "Failed to upload image. Please try again.",
        })
        } finally {
        setLoading(false)
        }
    }

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
          <DialogTitle>Add New Plan</DialogTitle>
          <DialogDescription>Create a new subscription plan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.image || "/placeholder.svg"} />
                  <AvatarFallback>
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "PL"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium Plan"
                    required disabled={loading}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="amount">Amount per day</Label>
                <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., 100"
                    required disabled={loading}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tenure">Tenure</Label>
                <div className="flex gap-4">
                    <Input
                        type='number'
                        id="tenure"
                        value={formData.tenure}
                        onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                        placeholder="e.g., 1 month"
                        required disabled={loading}
                    />
                    <span>days</span>
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Plan description</Label>
                <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., This is a premium plan and runs for 30 days."
                    required disabled={loading}
                />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
