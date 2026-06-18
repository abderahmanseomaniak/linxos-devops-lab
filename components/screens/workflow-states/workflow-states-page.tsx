"use client"

import { useEffect, useState, useCallback } from "react"
import { Typography } from "@/components/ui/typography"
import { workflowService } from "@/services/workflow.service"
import type { WorkflowState, WorkflowStateInsert, WorkflowStateUpdate } from "@/types/workflow.types"
import { supabase } from "@/services/supabase/client"
import { toast } from "sonner"
import { WorkflowStatesTable } from "./workflow-states-table"
import { AddWorkflowStateSheet } from "./sheets/add-workflow-state-sheet"
import { EditWorkflowStateSheet } from "./sheets/edit-workflow-state-sheet"

export function WorkflowStatesPage() {
  const [states, setStates] = useState<WorkflowState[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<WorkflowState | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await workflowService.getStates()
      setStates(data)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleCreate = async (data: WorkflowStateInsert) => {
    try {
      const { error } = await supabase.from("workflow_states").insert(data as never)
      if (error) throw error
      toast.success("État créé")
      setAddOpen(false)
      fetch()
    } catch {
      toast.error("Erreur lors de la création")
    }
  }

  const handleUpdate = async (id: string, data: WorkflowStateUpdate) => {
    try {
      const { error } = await supabase.from("workflow_states").update(data).eq("id", id)
      if (error) throw error
      toast.success("État mis à jour")
      setEditOpen(false)
      setEditing(null)
      fetch()
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("workflow_states").delete().eq("id", id)
      if (error) throw error
      toast.success("État supprimé")
      fetch()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  const filtered = search
    ? states.filter((s) =>
        [s.code, s.label, s.description].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
      )
    : states

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">États de workflow</Typography>
          <Typography variant="muted">Configurez les étapes du cycle de vie</Typography>
        </div>
      </div>

      <WorkflowStatesTable
        data={filtered}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onEdit={(s) => { setEditing(s); setEditOpen(true) }}
        onDelete={handleDelete}
        onAdd={() => setAddOpen(true)}
      />

      <AddWorkflowStateSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleCreate}
      />

      {editing && (
        <EditWorkflowStateSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          state={editing}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}
