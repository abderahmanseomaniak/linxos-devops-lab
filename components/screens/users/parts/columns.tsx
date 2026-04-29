"use client"

import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { UserItem, UserRole } from "@/types/users"
import { ROLE_LABELS } from "../lib/constants"
import { multiColumnFilterFn, statusFilterFn } from "../lib/filter-fns"
import { RowActions } from "./row-actions"

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

export const columns: ColumnDef<UserItem>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected()
      const isSomeSelected = table.getIsSomePageRowsSelected()
      const checked = isAllSelected || (isSomeSelected && "indeterminate")
      return (
        <Checkbox
          aria-label="Select all"
          checked={checked || false}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      )
    },
    id: "select",
    size: 40,
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    enableHiding: false,
    filterFn: multiColumnFilterFn,
    header: "Name",
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
  },
  {
    accessorKey: "phone",
    header: "IconPhone",
    size: 150,
  },
  {
    accessorKey: "cin",
    header: "CIN",
    size: 100,
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole
      return (
        <Select defaultValue={role}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    header: "Role",
    size: 120,
  },
  {
    accessorKey: "statusDisplay",
    cell: ({ row }) => (
      <Badge
        className={row.getValue("statusDisplay") === "Inactive" ? "bg-muted-foreground/60 text-primary-foreground" : undefined}
      >
        {row.getValue("statusDisplay")}
      </Badge>
    ),
    filterFn: statusFilterFn,
    header: "Status",
    size: 100,
  },
  {
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    size: 60,
  },
]