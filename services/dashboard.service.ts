import { supabase } from "@/services/supabase/client"
import type { WorkflowState } from "@/types/workflow.types"

export interface DashboardOverview {
  totalEvents: number
  activeEvents: number
  pendingDelivery: number
  completionRate: string
  totalUsers: number
  totalUsersAll: number
  averageScore: number
}

export interface DashboardSponsoringStats {
  totalApplications: number
  pendingReview: number
  approved: number
  rejected: number
}

export interface DashboardLogisticsStats {
  preparing: number
  inDelivery: number
  delivered: number
  issues: number
}

export interface PipelineStage {
  state: WorkflowState
  count: number
  color: string
}

export interface RecentEvent {
  id: string
  title: string
  club_name: string | null
  city: string | null
  state_label: string | null
  state_code: string | null
  tracking_code: string
  created_at: string
}

export interface UpcomingEvent {
  id: string
  title: string
  city: string | null
  start_date: string | null
  daysUntil: number
}

export interface StockSummary {
  product_name: string
  total: number
  available: number
  reserved: number
}

export interface DashboardData {
  overview: DashboardOverview
  sponsoring: DashboardSponsoringStats
  logistics: DashboardLogisticsStats
  pipeline: PipelineStage[]
  recentEvents: RecentEvent[]
  upcomingEvents: UpcomingEvent[]
  stockSummary: StockSummary[]
}

const FALLBACK: DashboardData = {
  overview: { totalEvents: 0, activeEvents: 0, pendingDelivery: 0, completionRate: "0", totalUsers: 0, totalUsersAll: 0, averageScore: 0 },
  sponsoring: { totalApplications: 0, pendingReview: 0, approved: 0, rejected: 0 },
  logistics: { preparing: 0, inDelivery: 0, delivered: 0, issues: 0 },
  pipeline: [],
  recentEvents: [],
  upcomingEvents: [],
  stockSummary: [],
}

async function getOverview(): Promise<DashboardOverview> {
  try {
    const { data: allStates } = await supabase.from("workflow_states").select("id, code")

    const terminalCodes = new Set(["REJECTED", "CLOSED"])
    const activeStateIds = (allStates ?? [])
      .filter((s) => !terminalCodes.has(s.code))
      .map((s) => s.id)

    const [
      { count: totalEvents },
      { count: activeEvents },
      { count: pendingDelivery },
      { count: delivered },
      { count: totalUsers },
      { count: totalUsersAll },
      { data: scoreData },
    ] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      activeStateIds.length > 0
        ? supabase.from("events").select("*", { count: "exact", head: true }).in("state_id", activeStateIds)
        : supabase.from("events").select("*", { count: "exact", head: true }).not("state_id", "is", null),
      supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "IN_DELIVERY"),
      supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "DELIVERED"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("ai_analyses").select("score").not("score", "is", null).limit(1000),
    ])

    const total = totalEvents ?? 0
    const deliveredCount = delivered ?? 0
    const completionRate = total > 0 ? Math.round((deliveredCount / total) * 100) + "%" : "0%"

    const scores = (scoreData ?? []) as { score: number | null }[]
    const validScores = scores.filter((s) => s.score != null).map((s) => Number(s.score))
    const averageScore = validScores.length > 0
      ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10
      : 0

    return {
      totalEvents: total,
      activeEvents: activeEvents ?? 0,
      pendingDelivery: pendingDelivery ?? 0,
      completionRate,
      totalUsers: totalUsers ?? 0,
      totalUsersAll: totalUsersAll ?? 0,
      averageScore,
    }
  } catch (err) {
    console.warn("[dashboard] getOverview failed:", err)
    return FALLBACK.overview
  }
}

async function getSponsoringStats(): Promise<DashboardSponsoringStats> {
  try {
    const { data: rawStates } = await supabase.from("workflow_states").select("id, code")

    if (!rawStates) return FALLBACK.sponsoring

    const states = rawStates as unknown as { id: string; code: string }[]

    const pendingCodes = new Set(["SUBMITTED", "SCORED", "NEEDS_CLARIFICATION"])
    const approvedCodes = new Set(["VALIDATED", "CONFIRMATION_SENT", "CONFIRMED", "ALLOCATED", "PREPARING_SHIPMENT", "IN_DELIVERY", "DELIVERED"])
    const rejectedCodes = new Set(["REJECTED"])

    let pendingCount = 0
    let approvedCount = 0
    let rejectedCount = 0

    for (const s of states) {
      if (pendingCodes.has(s.code)) pendingCount++
      else if (approvedCodes.has(s.code)) approvedCount++
      else if (rejectedCodes.has(s.code)) rejectedCount++
    }

    const totalApplications = pendingCount + approvedCount + rejectedCount

    return {
      totalApplications,
      pendingReview: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    }
  } catch (err) {
    console.warn("[dashboard] getSponsoringStats failed:", err)
    return FALLBACK.sponsoring
  }
}

async function getLogisticsStats(): Promise<DashboardLogisticsStats> {
  try {
    const { data: rawShipments } = await supabase.from("shipments").select("status")

    if (!rawShipments) return FALLBACK.logistics

    const shipments = rawShipments as unknown as { status: string }[]

    let preparing = 0
    let inDelivery = 0
    let delivered = 0
    let issues = 0

    for (const s of shipments) {
      if (s.status === "PREPARING") preparing++
      else if (s.status === "IN_DELIVERY") inDelivery++
      else if (s.status === "DELIVERED") delivered++
      else if (s.status === "PROBLEM" || s.status === "CANCELLED") issues++
    }

    return { preparing, inDelivery, delivered, issues }
  } catch (err) {
    console.warn("[dashboard] getLogisticsStats failed:", err)
    return FALLBACK.logistics
  }
}

async function getPipeline(): Promise<PipelineStage[]> {
  try {
    const { data: rawStates } = await supabase.from("workflow_states").select("*")

    if (!rawStates || rawStates.length === 0) return []

    const states = rawStates as unknown as { id: string; code: string; label: string; description: string | null }[]

    const counts = await Promise.all(
      states.map((s) =>
        supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("state_id", s.id as never)
      )
    )

    const PIPELINE_COLORS: Record<string, string> = {
      SUBMITTED: "bg-blue-500",
      SCORED: "bg-amber-500",
      VALIDATED: "bg-emerald-500",
      CONFIRMED: "bg-indigo-500",
      PREPARING_SHIPMENT: "bg-purple-500",
      IN_DELIVERY: "bg-orange-500",
      DELIVERED: "bg-green-500",
      CLOSED: "bg-gray-500",
      REJECTED: "bg-red-500",
    }

    return states.map((s, i) => ({
      state: s as unknown as WorkflowState,
      count: counts[i].count ?? 0,
      color: PIPELINE_COLORS[s.code as string] ?? "bg-gray-500",
    }))
  } catch (err) {
    console.warn("[dashboard] getPipeline failed:", err)
    return []
  }
}

async function getRecentEvents(limit = 5): Promise<RecentEvent[]> {
  try {
    const { data } = await supabase
      .from("events")
      .select(`
        id, title, city, tracking_code, created_at,
        club:clubs(name),
        state:workflow_states(label, code)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!data) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as unknown as Record<string, any>[]).map((e) => ({
      id: e.id,
      title: e.title,
      club_name: e.club?.name ?? null,
      city: e.city,
      state_label: e.state?.label ?? null,
      state_code: e.state?.code ?? null,
      tracking_code: e.tracking_code,
      created_at: e.created_at,
    }))
  } catch (err) {
    console.warn("[dashboard] getRecentEvents failed:", err)
    return []
  }
}

async function getUpcomingEvents(limit = 5): Promise<UpcomingEvent[]> {
  try {
    const today = new Date().toISOString().split("T")[0]

    const { data: rawData } = await supabase
      .from("events")
      .select("id, title, city, start_date")
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(limit)

    if (!rawData) return []

    const rows = rawData as unknown as { id: string; title: string; city: string | null; start_date: string | null }[]
    const now = new Date()

    return rows.map((e) => ({
      id: e.id,
      title: e.title,
      city: e.city,
      start_date: e.start_date,
      daysUntil: e.start_date
        ? Math.max(0, Math.ceil((new Date(e.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0,
    }))
  } catch (err) {
    console.warn("[dashboard] getUpcomingEvents failed:", err)
    return []
  }
}

async function getStockSummary(): Promise<StockSummary[]> {
  try {
    const { data: rawData } = await supabase
      .from("campaign_stocks")
      .select(`
        total_quantity, available_quantity, reserved_quantity,
        product:products(name)
      `)
      .limit(10)

    if (!rawData) return []

    const rows = rawData as unknown as { total_quantity: number; available_quantity: number; reserved_quantity: number; product: { name: string } | null }[]

    return rows.map((s) => ({
      product_name: s.product?.name ?? "Unknown",
      total: s.total_quantity,
      available: s.available_quantity,
      reserved: s.reserved_quantity,
    }))
  } catch (err) {
    console.warn("[dashboard] getStockSummary failed:", err)
    return []
  }
}

async function getAll(): Promise<DashboardData> {
  const [overview, sponsoring, logistics, pipeline, recentEvents, upcomingEvents, stockSummary] =
    await Promise.all([
      getOverview(),
      getSponsoringStats(),
      getLogisticsStats(),
      getPipeline(),
      getRecentEvents(),
      getUpcomingEvents(),
      getStockSummary(),
    ])

  return { overview, sponsoring, logistics, pipeline, recentEvents, upcomingEvents, stockSummary }
}

export const dashboardService = {
  getOverview,
  getSponsoringStats,
  getLogisticsStats,
  getPipeline,
  getRecentEvents,
  getUpcomingEvents,
  getStockSummary,
  getAll,
}
