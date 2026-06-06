"use client"

import { useState } from "react"
import { trackingService } from "@/services/tracking.service"
import type { TrackApplicationData } from "../types/track.types"

interface UseTrackSearchReturn {
  code: string
  email: string
  setCode: (code: string) => void
  setEmail: (email: string) => void
  loading: boolean
  error: string
  result: TrackApplicationData | null
  searched: boolean
  handleSearch: () => void
}

export function useTrackSearch(): UseTrackSearchReturn {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackApplicationData | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError("Veuillez entrer un code de suivi")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setSearched(false)

    try {
      const data = await trackingService.trackApplication(trimmed.toUpperCase(), email.trim() || undefined)
      if (data.found && data.event) {
        setResult(data)
      } else {
        setError("Aucune demande trouvée avec ces identifiants")
      }
    } catch {
      setError("Erreur lors de la recherche")
    }

    setLoading(false)
    setSearched(true)
  }

  return { code, email, setCode, setEmail, loading, error, result, searched, handleSearch }
}
