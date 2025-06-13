import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'
import { Branches } from '@/lib/types'


interface AddBranchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  Branches: Branches[]
}
export default function AddBranchModal({ open, onOpenChange, Branches }: AddBranchModalProps) {
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {

      const branchData = {
        name: formData.name,
        createdAt: serverTimestamp(),
      }


      const docRef = await addDoc(collection(db, "branches"), branchData)

      // Create notification
    //   await notifyClassCreated(formData.name, docRef.id)

      toast("Branch created", {
        description: "The branch has been successfully created.",
      })

      setFormData({ name: "" })
      onOpenChange(false)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create the branch.",
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
          <DialogDescription>Create a new subscription branch.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Enter branch name"
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
