"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { IconRefresh, IconDownload } from "@tabler/icons-react"

export default function ReportingPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ totalEvents: number; totalUgc: number } | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data: events } = await supabase.from("events").select("id")
      const { count: ugcCount } = await supabase.from("ugc_contents").select("*", { count: "exact", head: true })

      setStats({
        totalEvents: events?.length ?? 0,
        totalUgc: ugcCount ?? 0,
      })
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleExport = () => {
    const csv = "Export reporting\n"
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "reporting.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Reporting</Typography>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
          <Button variant="outline" className="h-8 text-xs" onClick={handleExport}>
            <IconDownload className="size-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Total événements</CardTitle></CardHeader>
            <CardContent><Typography variant="p" className="text-2xl font-bold">{stats?.totalEvents ?? 0}</Typography></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Contenus UGC</CardTitle></CardHeader>
            <CardContent><Typography variant="p" className="text-2xl font-bold">{stats?.totalUgc ?? 0}</Typography></CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
