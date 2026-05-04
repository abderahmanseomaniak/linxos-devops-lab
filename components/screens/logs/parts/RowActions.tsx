import type { Row } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ActivityLog } from "@/types/logs"

interface RowActionsProps {
  row: Row<ActivityLog>
  onViewDetails: (log: ActivityLog) => void
}

export function RowActions({ row, onViewDetails }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button aria-label="View details" className="shadow-none" size="icon" variant="ghost">
            <IconDots aria-hidden="true" size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
            <span>View Details</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
