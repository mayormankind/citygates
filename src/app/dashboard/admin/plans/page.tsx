"use client"
import { app, db } from '@/lib/firebaseConfig'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Pause, Play, Plus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddPlanModal from '@/components/modals/add-plan-modal'
import Image from 'next/image'
import { Plan } from '@/lib/types'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'


export default function page() {

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    // Real-time listener for plans
    const unsubscribePlans = onSnapshot(collection(db, "plans"), (snapshot) => {
      const plansData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Plan[]
      setPlans(plansData)
      setLoading(false)
    })
    return () => unsubscribePlans()
  }, [])

  const filteredPlans = plans.filter((plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.amount.toString().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePlanStatusChange = async (planId: string, newStatus: 'active' | 'inactive') => {
    setLoading(true)
    try {
      const planRef = doc(db, "plans", planId)
      await updateDoc(planRef, { status: newStatus })
      toast.success(`Plan ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating plan status:", error)
      toast.error("Failed to update plan status.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">Plans</h1>
          <p className="text-gray-600 m-0">Manage your subscription plans</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search plans by name or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>  
                <TableHead>Description</TableHead>  
                <TableHead>Status</TableHead>  
                <TableHead>Actions</TableHead>  
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.length === 0 && loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No plans available. Please add a plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <Image width={1000} height={1000} src={plan.image} alt={plan.name} loading='lazy' className="w-12 h-12 rounded-md" />
                      </TableCell>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{plan.amount}</TableCell>
                      <TableCell>{plan.description}</TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${plan.status === 'active' ? 'bg-green-100 text-green-800' : plan.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            className='bg-blue-600 text-white'
                            variant={'ghost'} title='Edit Plan' onClick={() => setShowEditModal(true)}>
                            <Edit aria-label='Edit Plan' className="h-4 w-4" />
                          </Button>
                          {plan.status === 'active' ? (
                            <Button
                              className='bg-red-500 text-white'
                              variant={'ghost'}
                              title='Pause Plan'
                              onClick={() => handlePlanStatusChange(plan.id, 'inactive')}
                            >
                              <Pause aria-label='Pause Plan' className="h-4 w-4 " />
                            </Button>
                          ) : (
                            <Button
                              variant={'ghost'}
                              className='bg-green-700 text-white'
                              title='Resume Plan'
                              onClick={() => handlePlanStatusChange(plan.id, 'active')}
                          >
                            <Play aria-label='Resume Plan' className="h-4 w-4" />
                          </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
            </TableBody>
          </Table>
        </CardContent>

      </Card>

      {showAddModal && <AddPlanModal open={showAddModal} onOpenChange={setShowAddModal} Plans={[]} />}
    </div>
  )
}
