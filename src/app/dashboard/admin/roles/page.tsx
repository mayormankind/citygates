"use client";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Role } from "@/lib/types"; 
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import CreateRoleModal from "@/components/modals/create-role-modal";
import EditRoleModal from "@/components/modals/edit-role-modal";

export default function RolesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]); 

  useEffect(() => {
    setLoading(true);
    const unsubscribeRoles = onSnapshot(collection(db, "roles"), (snapshot) => {
      const rolesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        permissions: doc.data().permissions || [],
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Role[];
      setRoles(rolesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching roles:", error);
      setLoading(false);
    });
    return () => unsubscribeRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setShowEditModal(true);
    } else {
      console.error("Role not found");
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:px-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0 text-start">Roles</h1>
          <p className="text-gray-600 m-0">Manage user roles and permissions here.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Role
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
                  placeholder="Search roles by name"
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
                <TableHead className="w-1/3">S/N</TableHead>
                <TableHead className="w-1/3">Title</TableHead>
                <TableHead className="w-1/3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Roles...
                    </div>
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No roles available. Please add a role.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell className="w-1/3">{index + 1}</TableCell>
                    <TableCell className="w-1/3">{role.name}</TableCell>
                    <TableCell className="w-1/3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          title="Edit Role"
                          onClick={() => handleEditRole(role.id)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddModal && (
        <CreateRoleModal open={showAddModal} onOpenChange={setShowAddModal} />
      )}
      
      {showEditModal && selectedRole && (
        <EditRoleModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          role={selectedRole}
        />
      )}
    </div>
  );
}