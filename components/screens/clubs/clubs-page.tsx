"use client"

import { useEffect, useState } from "react"
import { Typography } from "@/components/ui/typography"
import { useClubsStore } from "@/stores/clubs.store"
import type { Club, ClubInsert, ClubUpdate } from "@/types/clubs.types"
import { toast } from "sonner"
import { ClubsTable } from "./clubs-table"
import { AddClubSheet } from "./sheets/add-club-sheet"
import { EditClubSheet } from "./sheets/edit-club-sheet"

export function ClubsPage() {
  const {
    clubs, loading, filters,
    fetchClubs, createClub, updateClub, deleteClub,
    setFilters,
  } = useClubsStore()

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Club | null>(null)

  useEffect(() => { fetchClubs() }, [fetchClubs])

  const handleCreate = async (data: ClubInsert) => {
    const created = await createClub(data)
    if (created) {
      toast.success("Club créé")
      setAddOpen(false)
    } else {
      toast.error("Erreur lors de la création")
    }
  }

  const handleUpdate = async (id: string, data: ClubUpdate) => {
    try {
      await updateClub(id, data)
      toast.success("Club mis à jour")
      setEditOpen(false)
      setEditing(null)
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClub(id)
      toast.success("Club supprimé")
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Clubs</Typography>
          <Typography variant="muted">Gérez les clubs et organisations partenaires</Typography>
        </div>
      </div>

      <ClubsTable
        data={clubs}
        loading={loading}
        search={filters.search}
        onSearchChange={(s) => setFilters({ search: s })}
        onEdit={(c) => { setEditing(c); setEditOpen(true) }}
        onDelete={handleDelete}
        onAdd={() => setAddOpen(true)}
      />

      <AddClubSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleCreate}
      />

      {editing && (
        <EditClubSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          club={editing}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}
