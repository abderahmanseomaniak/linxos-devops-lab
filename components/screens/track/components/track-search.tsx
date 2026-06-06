"use client"

import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import { Mail } from "lucide-react"

interface TrackSearchProps {
  code: string
  email: string
  onCodeChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSearch: () => void
  loading?: boolean
  error?: string
  className?: string
}

export function TrackSearch({ code, email, onCodeChange, onEmailChange, onSearch, loading, error, className }: TrackSearchProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Code de suivi (ex: LYNX-202606-ABCD)"
            className="h-10 pl-10 pr-10 font-mono text-sm"
            disabled={loading}
            aria-label="Code de suivi"
          />
          {code && !loading && (
            <button
              type="button"
              onClick={() => onCodeChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              aria-label="Effacer le code"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Email du demandeur (optionnel)"
            className="h-10 pl-10 text-sm"
            disabled={loading}
            aria-label="Email du demandeur"
          />
        </div>
      </div>
      <Button onClick={onSearch} disabled={loading} className="w-full h-10">
        {loading ? (
          <Loader2 className="size-4 animate-spin mr-2" />
        ) : (
          <Search className="size-4 mr-2" />
        )}
        {loading ? "Recherche..." : "Suivre ma demande"}
      </Button>
      {!!error && (
        <Typography variant="small" className="text-destructive animate-in slide-in-from-top-1 text-center block" role="alert">
          {error}
        </Typography>
      )}
    </div>
  )
}
