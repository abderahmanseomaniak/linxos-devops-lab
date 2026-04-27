"use client"

import { useState, useCallback } from "react"
import type { TrackResult } from "@/components/track/track.types"

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
  clearError: () => void
}

export function useTrackSearch({ data }: UseTrackSearchOptions): UseTrackSearchReturn {
  const [code, setCodeState] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackResult | null>(null)
  const [searched, setSearched] = useState(false)

  const setCode = useCallback((value: string) => {
    console.log("[TrackSearch] setCode called with:", value)
    setCodeState(value)
  }, [])

  const clearError = useCallback(() => {
    setError("")
  }, [])

  const handleSearch = useCallback(() => {
    console.log("[TrackSearch] handleSearch called")
    console.log("[TrackSearch] code value:", code)
    console.log("[TrackSearch] data length:", data.length)

    if (!code.trim()) {
      console.log("[TrackSearch] Empty code - showing error")
      setError("Please enter a reference code")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setSearched(false)

    console.log("[TrackSearch] Set loading=true, searching...")

    const normalizedCode = code.trim().toUpperCase()
    console.log("[TrackSearch] Normalized code:", normalizedCode)
    console.log("[TrackSearch] References in data:", data.map((d) => d.reference))

    const found = data.find((item) => item.reference === normalizedCode)
    console.log("[TrackSearch] Found:", found)

    if (found) {
      console.log("[TrackSearch] Setting result:", found)
      setResult(found)
    } else {
      console.log("[TrackSearch] No result found - setting error")
      setError("No request found with this reference")
    }

    setLoading(false)
    setSearched(true)
    console.log("[TrackSearch] Search complete")
  }, [code, data])

  console.log("[TrackSearch] Render - code:", code, "loading:", loading, "searched:", searched, "result:", !!result, "error:", error)

  return {
    code,
    setCode,
    loading,
    error,
    result,
    searched,
    handleSearch,
    clearError,
  }
}