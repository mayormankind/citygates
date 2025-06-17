"use client"
import { db } from '@/lib/firebaseConfig'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Loader2, Pause, Play, Plus, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Store } from '@/lib/types'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import AddStoreModal from '@/components/modals/add-store-modal'

export default function Stores() {

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ stores, setStores ] = useState<Store[]>([])

  useEffect(() => {
    // Real-time listener for branches
    const unsubscribeStores = onSnapshot(collection(db, "stores"), (snapshot) => {
      const storesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Store[]
      setStores(storesData)
      setLoading(false)
    })
    return () => unsubscribeStores()
  }, [])

  const filteredStores = stores.filter((store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStoreStatusChange = async (storeId: string, newStatus: 'active' | 'inactive') => {
    setLoading(true)
    try {
      const storeRef = doc(db, "stores", storeId)
      await updateDoc(storeRef, { status: newStatus })
      toast.success(`Store ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating store status:", error)
      toast.error("Failed to update store status.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">Stores</h1>
          <p className="text-gray-600 m-0">Manage your store inventory and orders here.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Store
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
                  placeholder="Search stores by name or location..."
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
                <TableHead className="w-1/4">S/N</TableHead>
                <TableHead className="w-1/4">Store Name</TableHead>
                <TableHead className="w-1/4">Created At</TableHead>  
                <TableHead className="w-1/4">Actions</TableHead>  
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading stores...
                    </div>
                  </TableCell>
                </TableRow>
              ) : stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No stores available. Please add a store.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store, id) => (
                  <TableRow key={store.id}>
                    <TableCell className="w-1/4">{id + 1}</TableCell>
                    <TableCell className="w-1/4">{store.name}</TableCell>
                    <TableCell className="w-1/4">
                      {new Date(store.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-1/4">
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-blue-600 text-white"
                          variant="ghost"
                          title="Edit Branch"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Edit aria-label="Edit Store" className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-red-600 text-white"
                          variant="ghost"
                          title="Delete Store"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Trash2 aria-label="Delete Store" className="h-4 w-4" />
                        </Button>
                        {store.status === 'active' ? (
                          <Button
                            className="bg-red-500 text-white"
                            variant="ghost"
                            title="Pause store"
                            onClick={() => handleStoreStatusChange(store.id, 'inactive')}
                          >
                            <Pause aria-label="Pause Store" className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            className="bg-green-700 text-white"
                            variant="ghost"
                            title="Resume Store"
                            onClick={() => handleStoreStatusChange(store.id, 'active')}
                          >
                            <Play aria-label="Resume Store" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddModal && <AddStoreModal open={showAddModal} onOpenChange={setShowAddModal} Stores={[]} />}
    </div>
  )
}
