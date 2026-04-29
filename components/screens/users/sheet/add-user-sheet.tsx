"use client"

import React, { useMemo } from "react"
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

interface AddUserSheetProps {
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
  onAdd: () => void
}

export function AddUserSheet({ open, onOpenChange, formData, setFormData, onAdd }: AddUserSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-6 ">
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>Enter user information</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label htmlFor="add-name">Name *</Label>
            <Input
              id="add-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-email">Email *</Label>
            <Input
              id="add-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-phone">Phone</Label>
            <Input
              id="add-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-cin">CIN</Label>
            <Input
              id="add-cin"
              value={formData.cin}
              onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
              placeholder="Enter CIN"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <SelectTrigger id="add-role">
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
              id="add-status"
              checked={formData.status}
              onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })}
            />
            <Label htmlFor="add-status">Active</Label>
          </div>
          <Button className="mt-2 w-full" onClick={onAdd}>
            Add User
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}