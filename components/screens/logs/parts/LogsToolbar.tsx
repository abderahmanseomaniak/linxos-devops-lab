import { IconAdjustments, IconCircleX, IconColumns3, IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { actions } from "../lib/constants"
import type { Table } from "@tanstack/react-table"

interface LogsToolbarProps<TData = unknown> {
  id: string
  table: Table<TData>
  selectedActions: string[]
  handleActionChange: (checked: boolean, value: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  columnVisibility: Record<string, boolean>
}

export function LogsToolbar<TData = unknown>({
  id,
  table,
  selectedActions,
  handleActionChange,
  searchValue,
  onSearchChange,
  onSearchClear,
  columnVisibility,
}: LogsToolbarProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            aria-label="Filter by name or email"
            className={cn("peer min-w-60 ps-9", searchValue && "pe-9")}
            id={`${id}-input`}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by name or email..."
            type="text"
            value={searchValue}
            suppressHydrationWarning
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
            <IconAdjustments aria-hidden="true" size={16} />
          </div>
          {searchValue
            ? (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={onSearchClear}
                type="button"
              >
                <IconCircleX aria-hidden="true" size={16} />
              </button>
            )
            : null}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <IconFilter aria-hidden="true" className="-ms-1 opacity-60" size={16} />
              Action
              {selectedActions.length > 0 && (
                <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                  {selectedActions.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto min-w-36 p-3">
            <div className="space-y-3">
              <div className="font-medium text-muted-foreground text-xs">IconFilter by Action</div>
              <div className="space-y-3">
                {actions.map((value, i) => (
                  <div className="flex items-center gap-2" key={value}>
                    <Checkbox
                      checked={selectedActions.includes(value)}
                      id={`${id}-action-${i}`}
                      onCheckedChange={(checked: boolean) => handleActionChange(checked, value)}
                    />
                    <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-action-${i}`}>
                      {value}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <IconColumns3 aria-hidden="true" className="-ms-1 opacity-60" size={16} />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            {table.getAllColumns().filter((column: any) => column.getCanHide() && column.id !== "actions").map((column: any) => (
<DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                className="capitalize"
                key={column.id}
                onCheckedChange={(checked) => {
                  table.setColumnVisibility((old) => ({ ...old, [column.id]: checked }))
                }}
                onSelect={(event) => event.preventDefault()}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
