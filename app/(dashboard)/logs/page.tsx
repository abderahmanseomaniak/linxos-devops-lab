"use client"

import { Suspense } from "react"
import { ActivityLogs } from '@/components/screens/logs/ActivityLogs'

export default function LogsPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <ActivityLogs />
    </Suspense>
  )
}