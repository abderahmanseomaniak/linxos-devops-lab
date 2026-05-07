"use client"

import { useEffect, type ReactNode } from "react"
import { useConfigStore, useNotificationStore, useLogsStore } from "@/stores"

interface ZustandProviderProps {
  children: ReactNode
}

export function ZustandProvider({ children }: ZustandProviderProps) {
  const loadConfig = useConfigStore((state) => state.loadConfig)
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications)
  const fetchLogs = useLogsStore((state) => state.fetchLogs)

  useEffect(() => {
    loadConfig()

    fetchNotifications()
    fetchLogs()

    const interval = setInterval(() => {
      fetchNotifications()
    }, 60000)

    return () => clearInterval(interval)
  }, [loadConfig, fetchNotifications, fetchLogs])

  return <>{children}</>
}