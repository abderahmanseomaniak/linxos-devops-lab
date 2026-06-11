"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { WorkflowStateInsert, WorkflowCode } from "@/types/workflow.types"
import { WORKFLOW_CODES, WORKFLOW_LABELS } from "@/types/workflow.types"
import { toast } from "sonner"

interface AddWorkflowStateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: WorkflowStateInsert) => void
}

export function AddWorkflowStateSheet({ open, onOpenChange, onSave }: AddWorkflowStateSheetProps) {
  const [code, setCode] = useState<WorkflowCode>("SUBMITTED")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (!code.trim()) return toast.error("Le code est requis")
    if (!label.trim()) return toast.error("Le libellé est requis")
    onSave({ code: code as WorkflowCode, label: label.trim(), description: description || null })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Nouvel état</SheetTitle>
          <SheetDescription>Créez un nouvel état de workflow</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Code *</Label>
            <Select value={code} onValueChange={(v) => setCode(v as WorkflowCode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOW_CODES.map((c) => (
                  <SelectItem key={c} value={c}>{c} - {WORKFLOW_LABELS[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Libellé *</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Libellé de l'état" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description optionnelle" rows={3} />
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            Créer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
