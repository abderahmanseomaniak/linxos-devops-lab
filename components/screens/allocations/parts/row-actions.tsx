"use client"

import type { Row } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { TRANSITIONS_MAP } from "@/services/workflow.service"
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/types/workflow.types"
import type { Allocation } from "@/types/shipments.types"
import type { WorkflowCode } from "@/types/workflow.types"

const TRANSITION_LABELS: Partial<Record<WorkflowCode, string>> = {
  PREPARING_SHIPMENT: "Passer en préparation",
  IN_DELIVERY: "Marquer en livraison",
  DELIVERED: "Marquer livré",
  UGC_PENDING: "Passer en UGC",
  CONTENT_REVIEWED: "Contenu vérifié",
  CLOSED: "Clôturer",
  REJECTED: "Rejeter",
  REPORTED: "Signaler",
}

interface RowActionsProps {
  row: Row<Allocation>
  transitionLoading?: string | null
  onView?: (allocation: Allocation) => void
  onEdit?: (allocation: Allocation) => void
  onDelete?: (allocation: Allocation) => void
  onTransition?: (eventId: string, targetCode: WorkflowCode) => void
}

export function RowActions({ row, transitionLoading, onView, onEdit, onDelete, onTransition }: RowActionsProps) {
  const state = row.original.event?.state as { code: WorkflowCode; label: string } | undefined
  const currentCode = state?.code
  const transitions = currentCode ? (TRANSITIONS_MAP[currentCode] ?? []) : []
  const isTransitioning = transitionLoading === row.original.event_id

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          {isTransitioning ? <Spinner className="size-4" /> : <IconDotsVertical className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(row.original)}>
          Voir détails
        </DropdownMenuItem>
        {transitions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {transitions.map((targetCode) => (
              <DropdownMenuItem
                key={targetCode}
                onClick={() => onTransition?.(row.original.event_id, targetCode as WorkflowCode)}
                disabled={isTransitioning}
                className={
                  targetCode === "REJECTED" || targetCode === "REPORTED"
                    ? "text-destructive focus:text-destructive"
                    : undefined
                }
              >
                <span
                  className="inline-block size-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: WORKFLOW_COLORS[targetCode as WorkflowCode] }}
                />
                {TRANSITION_LABELS[targetCode as WorkflowCode] ?? WORKFLOW_LABELS[targetCode as WorkflowCode]}
              </DropdownMenuItem>
            ))}
          </>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Modifier
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row.original)}>
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
