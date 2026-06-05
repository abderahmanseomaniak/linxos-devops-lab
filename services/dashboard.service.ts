import { supabase } from "@/services/supabase/client"

// ── Types ─────────────────────────────────────────

export interface DashboardOverview {
  totalEvents: number
  activeEvents: number
  pendingDelivery: number
  completionRate: string
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

export interface DashboardContentStats {
  waiting: number
  received: number
  editing: number
  posted: number
}

// ── Internal helpers ──────────────────────────────

function extractFirstRow(data: unknown): Record<string, unknown> {
  if (Array.isArray(data) && data.length > 0) {
    return data[0] as Record<string, unknown>
  }
  return {}
}

function toNumber(val: unknown, fallback = 0): number {
  const n = Number(val)
  return Number.isFinite(n) ? n : fallback
}

// ── Overview ─────────────────────────────────────

async function getOverview(): Promise<DashboardOverview> {
  const fallback: DashboardOverview = {
    totalEvents: 0,
    activeEvents: 0,
    pendingDelivery: 0,
    completionRate: "0",
  }

  try {
    const { data, error } = await supabase
      .from("dashboard_sponsoring_view")
      .select("*")
      .limit(1)

    if (error) {
      console.warn("[dashboard] dashboard_sponsoring_view error:", error.message)
      return fallback
    }

    const row = extractFirstRow(data)

    return {
      totalEvents: toNumber(row.total_events ?? row.totalEvents),
      activeEvents: toNumber(row.active_events ?? row.activeEvents),
      pendingDelivery: toNumber(row.pending_delivery ?? row.pendingDelivery),
      completionRate: String(row.completion_rate ?? row.completionRate ?? "0"),
    }
  } catch (err) {
    console.error("[dashboard] getOverview failed:", err)
    return fallback
  }
}

// ── Sponsoring Stats ─────────────────────────────

async function getSponsoringStats(): Promise<DashboardSponsoringStats> {
  const fallback: DashboardSponsoringStats = {
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
  }

  try {
    const { data, error } = await supabase
      .from("dashboard_sponsoring_view")
      .select("*")
      .limit(1)

    if (error) {
      console.warn("[dashboard] dashboard_sponsoring_view error:", error.message)
      return fallback
    }

    const row = extractFirstRow(data)

    return {
      totalApplications: toNumber(row.total_applications ?? row.totalApplications),
      pendingReview: toNumber(row.pending_review ?? row.pendingReview),
      approved: toNumber(row.approved),
      rejected: toNumber(row.rejected),
    }
  } catch (err) {
    console.error("[dashboard] getSponsoringStats failed:", err)
    return fallback
  }
}

// ── Logistics Stats ──────────────────────────────

async function getLogisticsStats(): Promise<DashboardLogisticsStats> {
  const fallback: DashboardLogisticsStats = {
    preparing: 0,
    inDelivery: 0,
    delivered: 0,
    issues: 0,
  }

  try {
    const { data, error } = await supabase
      .from("dashboard_logistics_view")
      .select("*")
      .limit(1)

    if (error) {
      console.warn("[dashboard] dashboard_logistics_view error:", error.message)
      return fallback
    }

    const row = extractFirstRow(data)

    return {
      preparing: toNumber(row.preparing),
      inDelivery: toNumber(row.in_delivery ?? row.inDelivery),
      delivered: toNumber(row.delivered),
      issues: toNumber(row.issues),
    }
  } catch (err) {
    console.error("[dashboard] getLogisticsStats failed:", err)
    return fallback
  }
}

// ── Content Stats ────────────────────────────────

async function getContentStats(): Promise<DashboardContentStats> {
  const fallback: DashboardContentStats = {
    waiting: 0,
    received: 0,
    editing: 0,
    posted: 0,
  }

  try {
    const { data, error } = await supabase
      .from("dashboard_content_view")
      .select("*")
      .limit(1)

    if (error) {
      console.warn("[dashboard] dashboard_content_view error:", error.message)
      return fallback
    }

    const row = extractFirstRow(data)

    return {
      waiting: toNumber(row.waiting),
      received: toNumber(row.received),
      editing: toNumber(row.editing),
      posted: toNumber(row.posted),
    }
  } catch (err) {
    console.error("[dashboard] getContentStats failed:", err)
    return fallback
  }
}

// ── Export ────────────────────────────────────────

export const dashboardService = {
  getOverview,
  getSponsoringStats,
  getLogisticsStats,
  getContentStats,
}
