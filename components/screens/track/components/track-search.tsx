"use client"

import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TrackSearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  loading?: boolean
  error?: string
  className?: string
}

export function TrackSearch({ value, onChange, onSearch, loading, error, className }: TrackSearchProps) {
  const handleClear = () => onChange("")

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Enter your reference (e.g. SPO-2026-002)"
            className="h-10 pl-10 pr-10 font-mono text-sm"
            disabled={loading}
            aria-label="Reference code"
          />
          {value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              aria-label="Clear input"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button onClick={onSearch} disabled={loading} className="h-10 px-4">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Track"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive animate-in slide-in-from-top-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}