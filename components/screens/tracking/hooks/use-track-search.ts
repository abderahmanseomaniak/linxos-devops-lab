"use client"

import { useState, useCallback } from "react"
import type { TrackResult } from "@/components/screens/tracking/types/track.types"

interface UseTrackSearchOptions {
  data: TrackResult[]
}

interface UseTrackSearchReturn {
  code: string
  setCode: (code: string) => void
  loading: boolean
  error: string
  result: TrackResult | null
  searched: boolean
  handleSearch: () => void
}

export function useTrackSearch({ data }: UseTrackSearchOptions): UseTrackSearchReturn {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackResult | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(() => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError("Please enter a reference code")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setSearched(false)

    const normalized = trimmed.toUpperCase()
    const found = data.find((item) => item.reference === normalized)

    if (found) {
      setResult(found)
    } else {
      setError("No request found with this reference")
    }

    setLoading(false)
    setSearched(true)
  }, [code, data])

  return { code, setCode, loading, error, result, searched, handleSearch }
}