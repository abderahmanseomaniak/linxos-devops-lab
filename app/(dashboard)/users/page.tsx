"use client"

import { useEffect, useState, useCallback } from "react"
import { UsersTable } from "@/components/screens/users/users-table"
import { usersService } from "@/services/users.service"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { AddUserSheet } from "@/components/screens/users/sheet/add-user-sheet"
import { EditUserSheet } from "@/components/screens/users/sheet/edit-user-sheet"
import { UserDetailsSheet } from "@/components/screens/users/sheet/details-user-sheet"
import type { Profile } from "@/types/profiles.types"

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const result = await usersService.list({ pageSize: 100 })
      setProfiles(result.data)
    } catch {
      console.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Utilisateurs</Typography>
        <Button onClick={() => setShowAdd(true)}>Ajouter</Button>
      </div>
      <UsersTable
        data={profiles}
        onRefresh={fetchUsers}
        onEdit={(user) => { setSelectedUser(user); setShowEdit(true) }}
        onDelete={async (user) => {
          try {
            await usersService.remove(user.id)
            await fetchUsers()
          } catch { console.error("Failed to delete user") }
        }}
        onView={(user) => { setSelectedUser(user); setShowDetails(true) }}
      />
      <AddUserSheet open={showAdd} onOpenChange={setShowAdd} onCreated={fetchUsers} />
      {selectedUser && (
        <>
          <EditUserSheet open={showEdit} onOpenChange={setShowEdit} user={selectedUser} onUpdated={fetchUsers} />
          <UserDetailsSheet open={showDetails} onOpenChange={setShowDetails} user={selectedUser} />
        </>
      )}
    </div>
  )
}
