import { supabase } from "@/services/supabase/client"
import type { PlatformConfig } from "@/types/config"

// ── Defaults ──────────────────────────────────────

const DEFAULT_CONFIG: PlatformConfig = {
  ugcSettings: {
    minUgcCreators: 3,
  },
  eventPipeline: {
    defaultEventStages: [
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "CONFIRMED",
      "SHIPPED",
      "COMPLETED",
    ],
  },
  scoringSystem: {
    scoringWeights: {
      audienceWeight: 0.3,
      engagementWeight: 0.3,
      contentQualityWeight: 0.4,
    },
  },
  notificationSettings: {
    emailEnabled: true,
    inAppEnabled: true,
    deliveryAlerts: true,
    contentAlerts: true,
  },
}

// ── Get Config ───────────────────────────────────

async function getConfig(): Promise<PlatformConfig> {
  try {
    const { data, error } = await supabase
      .from("platform_config")
      .select("*")
      .single()

    if (error) {
      if (error.code === "PGRST116" || error.code === "42P01") {
        // Table not found or no rows — return defaults
        console.warn(
          "[config] platform_config table not available, using defaults"
        )
        return { ...DEFAULT_CONFIG }
      }
      throw error
    }

    if (!data) return { ...DEFAULT_CONFIG }

    // Merge stored config with defaults to fill any missing keys
    const stored = data as Record<string, unknown>

    return {
      ...DEFAULT_CONFIG,
      ...(stored.config
        ? (stored.config as Partial<PlatformConfig>)
        : (stored as unknown as Partial<PlatformConfig>)),
    } satisfies PlatformConfig
  } catch (err) {
    // If anything goes wrong (network, permissions, etc.), return safe defaults
    console.error("[config] getConfig failed, returning defaults:", err)
    return { ...DEFAULT_CONFIG }
  }
}

// ── Export ────────────────────────────────────────

export const configService = {
  getConfig,
}
