"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"

interface InfoRowProps {
  label: string
  value: string | React.ReactNode
  isBadge?: boolean
}

export function InfoRow({ label, value, isBadge }: InfoRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        {isBadge ? value : <Typography>{value || "-"}</Typography>}
      </div>
    </div>
  )
}