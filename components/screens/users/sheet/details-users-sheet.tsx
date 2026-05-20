"use client"

import React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Typography } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { UserItem, UserRole } from "@/types/users"
import { ROLE_LABELS } from "../lib/constants"
import { InfoRow } from "../parts/Info-row"

interface UserDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserItem
}

export function UserDetailsSheet({ open, onOpenChange, user }: UserDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>Full information about this user</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-8">
          <section className="flex flex-col items-center text-center">
            <Avatar className="size-24">
              <AvatarFallback className="text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Typography variant="h4" className="mt-3 font-semibold">{user.name}</Typography>
            <Typography variant="small" className="text-muted-foreground">{user.email}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">User Information</Typography>
            <div className="grid gap-2">
              <InfoRow label="Phone" value={user.phone || "—"} />
              <InfoRow label="CIN" value={user.cin || "—"} />
              <InfoRow label="Role" value={ROLE_LABELS[user.role as UserRole]} />
              <InfoRow
                label="Status"
                value={
                  <Badge className={user.status === false ? "bg-muted-foreground/60 text-primary-foreground" : undefined}>
                    {user.status ? "Active" : "Inactive"}
                  </Badge>
                }
                isBadge
              />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}