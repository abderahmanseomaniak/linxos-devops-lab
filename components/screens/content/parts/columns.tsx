"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { UGCContent } from "@/types/ugc.types"
import { RowActions } from "./row-actions"

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "X",
  linkedin: "LinkedIn",
}

const PLATFORM_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  instagram: "default",
  tiktok: "secondary",
  youtube: "destructive",
  facebook: "secondary",
  twitter: "outline",
  linkedin: "outline",
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Vidéo",
  reel: "Reel",
  story: "Story",
  carousel: "Carrousel",
  live: "Live",
}

function getScoreVariant(score: number | null | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (score === null || score === undefined) return "outline"
  if (score >= 7) return "default"
  if (score >= 4) return "secondary"
  return "destructive"
}

export const columns: ColumnDef<UGCContent>[] = [
  {
    id: "event",
    header: "Événement",
    accessorKey: "event.title",
    cell: ({ row }) => {
      const title = row.original.event?.title ?? "-"
      return <span className="font-medium text-sm">{title}</span>
    },
    size: 200,
    enableHiding: false,
  },
  {
    id: "platform",
    header: "Plateforme",
    accessorKey: "platform",
    cell: ({ row }) => {
      const platform = row.original.platform
      if (!platform) return <span className="text-sm">-</span>
      const label = PLATFORM_LABELS[platform] ?? platform
      return <Badge variant={PLATFORM_VARIANTS[platform] ?? "outline"}>{label}</Badge>
    },
    size: 120,
  },
  {
    id: "content_type",
    header: "Type",
    accessorKey: "content_type",
    cell: ({ row }) => {
      const type = row.original.content_type
      if (!type) return <span className="text-sm">-</span>
      const label = CONTENT_TYPE_LABELS[type] ?? type
      return <span className="text-sm">{label}</span>
    },
    size: 100,
  },
  {
    id: "views",
    header: "Vues",
    accessorKey: "views",
    cell: ({ row }) => {
      const v = row.original.views
      return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
    },
    size: 100,
  },
  {
    id: "likes",
    header: "Likes",
    accessorKey: "likes",
    cell: ({ row }) => {
      const v = row.original.likes
      return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
    },
    size: 100,
  },
  {
    id: "comments",
    header: "Commentaires",
    accessorKey: "comments",
    cell: ({ row }) => {
      const v = row.original.comments
      return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
    },
    size: 120,
  },
  {
    id: "url",
    header: "URL",
    accessorKey: "url",
    cell: ({ row }) => {
      const url = row.original.url
      if (!url) return <span className="text-sm">-</span>
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]"
        >
          {url}
        </a>
      )
    },
    size: 200,
  },
  {
    id: "score",
    header: "Score",
    accessorKey: "verification.global_score",
    cell: ({ row }) => {
      const score = row.original.verification?.global_score
      return <Badge variant={getScoreVariant(score)}>{score !== null && score !== undefined ? score : "-"}</Badge>
    },
    size: 80,
  },
  {
    id: "created_at",
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const d = row.original.created_at
      return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
    },
    size: 120,
  },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} />,
    },
]
