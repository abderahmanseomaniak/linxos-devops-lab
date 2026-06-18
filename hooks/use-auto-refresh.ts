"use client"

import { useEffect, useRef } from "react"
import { useRefreshStore } from "@/stores/refresh.store"

export function useAutoRefresh(table: string, refresh: () => void) {
  const counter = useRefreshStore((s) => s.counters[table])
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])
}
