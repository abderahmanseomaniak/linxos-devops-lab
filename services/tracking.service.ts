import { supabase } from "@/services/supabase/client"
import type { TrackApplicationData } from "@/components/screens/track/types/track.types"

async function trackApplication(
  code: string,
  email?: string
): Promise<TrackApplicationData> {
  const fallback: TrackApplicationData = { found: false }

  try {
    const { data, error } = await (supabase as any).rpc("track_application", {
      p_code: code,
      p_email: email ?? null,
    })

    if (!error && data) {
      return data as TrackApplicationData
    }

    console.warn("[tracking] RPC unavailable, using API fallback:", error?.message ?? error)
  } catch (err) {
    console.warn("[tracking] RPC threw, using API fallback:", err)
  }

  // ── Fallback: server-side API route (uses service_role key) ──
  try {
    const params = new URLSearchParams({ code })
    if (email) params.set("email", email)

    const res = await fetch(`/api/track?${params.toString()}`)
    const data = await res.json()

    if (!res.ok) {
      console.error("[tracking] API fallback error:", data.error ?? res.statusText)
      return fallback
    }

    return data as TrackApplicationData
  } catch (err) {
    console.error("[tracking] API fallback failed:", err)
    return fallback
  }
}

export const trackingService = {
  trackApplication,
}
