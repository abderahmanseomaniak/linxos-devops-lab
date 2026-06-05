// ──────────────────────────────────────────────
// Campaigns
// ──────────────────────────────────────────────
import { z } from 'zod';

// ── Constants ─────────────────────────────────
export const CAMPAIGN_STATUSES = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'ARCHIVED',
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: 'Brouillon',
  ACTIVE: 'Active',
  PAUSED: 'En pause',
  COMPLETED: 'Terminée',
  ARCHIVED: 'Archivée',
};

// ── Row type ──────────────────────────────────
export interface CampaignRow {
  id: string;
  name: string;
  type: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  created_at: string;
}

export interface CampaignInsert {
  id?: string;
  name: string;
  type?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: CampaignStatus;
  created_at?: string;
}

export interface CampaignUpdate {
  name?: string;
  type?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: CampaignStatus;
}

// ── Entity ────────────────────────────────────
export interface Campaign extends CampaignRow {
  events?: import('./events.types').Event[];
  stocks?: import('./inventory.types').CampaignStock[];
  allocations?: import('./shipments.types').Allocation[];
  scoring_profile?: import('./analytics.types').ScoringProfile;
}

// ── Zod schemas ───────────────────────────────
export const campaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Le nom de la campagne est requis'),
  type: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.enum(CAMPAIGN_STATUSES).default('DRAFT'),
  created_at: z.string().datetime().optional(),
});

export const campaignUpdateSchema = campaignSchema.partial().omit({ id: true, created_at: true });

export type CampaignSchemaType = z.infer<typeof campaignSchema>;
