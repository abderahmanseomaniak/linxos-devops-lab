"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { UserRole } from "@/types/users"
import { ROLE_LABELS } from "../lib/constants"

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

interface EditUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: {
    name: string
    email: string
    phone: string
    cin: string
    role: UserRole
    status: boolean
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    email: string
    phone: string
    cin: string
    role: UserRole
    status: boolean
  }>>
  onSave: () => void
}

export function EditUserSheet({ open, onOpenChange, formData, setFormData, onSave }: EditUserSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>Update user information</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-cin">CIN</Label>
            <Input
              id="edit-cin"
              value={formData.cin}
              onChange={(e) => setFormData((prev) => ({ ...prev, cin: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as UserRole }))}
            >
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="edit-status"
              checked={formData.status}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, status: !!checked }))}
            />
            <Label htmlFor="edit-status">Active</Label>
          </div>
          <Button className="mt-2 w-full" onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}